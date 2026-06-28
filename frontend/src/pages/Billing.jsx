import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/money';
import { downloadBillsCSV, downloadBillsPDF } from '../utils/exportUtils';
import PretextReceipt from '../components/PretextReceipt';
import {
  ReceiptIcon,
  PrinterIcon,
  DollarIcon,
  CheckIcon,
  ClockIcon,
  GridIcon,
  DownloadIcon,
} from '../components/icons';
import io from 'socket.io-client';
import '../styles/Billing.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || (typeof window !== 'undefined' ? window.location.origin : '');

const TAX_OPTIONS = [
  { label: 'No Tax', value: 0 },
  { label: 'GST 5%', value: 5 },
  { label: 'GST 12%', value: 12 },
  { label: 'GST 18%', value: 18 },
];

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', emoji: '💵' },
  { id: 'card', label: 'Card', emoji: '💳' },
  { id: 'upi', label: 'UPI', emoji: '📱' },
  { id: 'split', label: 'Split', emoji: '✂️' },
];

const Billing = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('generate'); // 'generate' | 'history'
  const [loading, setLoading] = useState(true);

  // Generate view state
  const [billableTables, setBillableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [activeBill, setActiveBill] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Bill editing state
  const [taxRate, setTaxRate] = useState(0);
  const [tipAmount, setTipAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paying, setPaying] = useState(false);

  // History view state
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Pretext receipt modal state
  const [receiptData, setReceiptData] = useState(null);

  // ---------- Data fetching ----------

  const loadBillableTables = useCallback(async () => {
    try {
      const res = await API.get('/billing/tables');
      setBillableTables(res.data?.data || []);
    } catch {
      // silent
    }
  }, []);

  const loadBills = useCallback(async () => {
    try {
      const res = await API.get('/billing');
      setBills(res.data?.data || []);
    } catch {
      // silent
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadBillableTables(), loadBills()]);
    setLoading(false);
  }, [loadBillableTables, loadBills]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // WebSocket: listen for billing events
  useEffect(() => {
    if (!user?.tenant_id) return;
    const socket = io(SOCKET_URL);
    socket.emit('join_tenant', user.tenant_id);
    socket.on('bill_created', loadAll);
    socket.on('bill_paid', loadAll);
    socket.on('order_updated', loadAll); // when orders become served
    return () => socket.disconnect();
  }, [user?.tenant_id, loadAll]);

  // ---------- Stats ----------

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBills = bills.filter(b => new Date(b.createdAt) >= today);
    const paidToday = todayBills.filter(b => b.payment_status === 'paid');
    const unpaidBills = bills.filter(b => b.payment_status === 'pending');

    return {
      billableTablesCount: billableTables.length,
      todayBillsCount: todayBills.length,
      todayRevenue: paidToday.reduce((s, b) => s + Number(b.total || 0), 0),
      unpaidCount: unpaidBills.length,
    };
  }, [bills, billableTables]);

  // ---------- Handlers ----------

  const handleGenerateBill = async (tableData) => {
    setGenerating(true);
    try {
      const res = await API.post('/billing/generate', {
        table_number: tableData.table_number,
        tax_rate: taxRate,
        discount_amount: Number(discountAmount) || 0,
      });
      const bill = res.data?.data;
      setActiveBill(bill);
      setSelectedTable(tableData.table_number);
      toast.success(`Bill #${bill.id} generated for Table ${tableData.table_number}`);
      loadBillableTables();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate bill');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateBill = async () => {
    if (!activeBill) return;
    try {
      const res = await API.put(`/billing/${activeBill.id}`, {
        tax_rate: taxRate,
        tip_amount: Number(tipAmount) || 0,
        discount_amount: Number(discountAmount) || 0,
      });
      setActiveBill(prev => ({ ...prev, ...res.data?.data?.dataValues || res.data?.data }));
      toast.success('Bill updated');
    } catch (err) {
      toast.error('Failed to update bill');
    }
  };

  const handlePayBill = async () => {
    if (!activeBill || !paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setPaying(true);
    try {
      await API.put(`/billing/${activeBill.id}/pay`, {
        payment_method: paymentMethod,
        tip_amount: Number(tipAmount) || 0,
      });
      toast.success('Payment recorded! Table reset to available.');
      setActiveBill(prev => ({ ...prev, payment_status: 'paid', payment_method: paymentMethod }));
      setPaymentMethod('');
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const handlePrintReceipt = async (billId) => {
    try {
      const res = await API.get(`/billing/${billId}/receipt`);
      const data = res.data?.data;
      if (!data) return;
      setReceiptData(data);
    } catch {
      toast.error('Failed to load receipt');
    }
  };

  const handleSelectBillHistory = async (bill) => {
    try {
      const res = await API.get(`/billing/${bill.id}`);
      setSelectedBill(res.data?.data);
      setActiveBill(res.data?.data);
      // Populate control values
      const b = res.data?.data;
      setTaxRate(Number(b.tax_rate || 0));
      setTipAmount(String(Number(b.tip_amount || 0) || ''));
      setDiscountAmount(String(Number(b.discount_amount || 0) || ''));
    } catch {
      toast.error('Failed to load bill');
    }
  };

  // ---------- Flatten items from a bill ----------
  const flattenItems = (bill) => {
    if (!bill?.Orders) return [];
    const map = {};
    for (const order of bill.Orders) {
      for (const oi of order.OrderItems || []) {
        const key = oi.menu_item_id;
        if (map[key]) {
          map[key].quantity += Number(oi.quantity);
          map[key].line_total += Number(oi.price) * Number(oi.quantity);
        } else {
          map[key] = {
            id: key,
            name: oi.MenuItem?.name || `Item #${key}`,
            price: Number(oi.price),
            quantity: Number(oi.quantity),
            line_total: Number(oi.price) * Number(oi.quantity),
          };
        }
      }
    }
    return Object.values(map);
  };

  // ---------- Computed for active bill ----------
  const billItems = useMemo(() => flattenItems(activeBill), [activeBill]);
  const computedSubtotal = Number(activeBill?.subtotal || 0);
  const computedTax = Math.round((computedSubtotal * taxRate) / 100 * 100) / 100;
  const computedTip = Number(tipAmount) || 0;
  const computedDiscount = Number(discountAmount) || 0;
  const computedTotal = Math.max(computedSubtotal + computedTax + computedTip - computedDiscount, 0);

  // ---------- Render ----------

  if (loading) return <div className="billing-page"><div className="billing-loading">Loading billing data...</div></div>;

  return (
    <div className="billing-page">
      <header className="billing-header">
        <div>
          <h1>Billing</h1>
          <p>Generate bills, record payments, and print receipts.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="billing-stats">
        <div className="billing-stat">
          <div className="billing-stat-ico"><GridIcon size={18} /></div>
          <div>
            <div className="billing-stat-val">{stats.billableTablesCount}</div>
            <div className="billing-stat-label">Ready to Bill</div>
          </div>
        </div>
        <div className="billing-stat">
          <div className="billing-stat-ico blue"><ReceiptIcon size={18} /></div>
          <div>
            <div className="billing-stat-val">{stats.todayBillsCount}</div>
            <div className="billing-stat-label">Bills Today</div>
          </div>
        </div>
        <div className="billing-stat">
          <div className="billing-stat-ico green"><DollarIcon size={18} /></div>
          <div>
            <div className="billing-stat-val">{formatMoney(stats.todayRevenue)}</div>
            <div className="billing-stat-label">Collected Today</div>
          </div>
        </div>
        <div className="billing-stat">
          <div className="billing-stat-ico purple"><ClockIcon size={18} /></div>
          <div>
            <div className="billing-stat-val">{stats.unpaidCount}</div>
            <div className="billing-stat-label">Unpaid Bills</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="billing-tabs">
        <button className={`billing-tab ${activeView === 'generate' ? 'active' : ''}`} onClick={() => { setActiveView('generate'); setActiveBill(null); }}>
          <ReceiptIcon size={15} /> Generate Bills
        </button>
        <button className={`billing-tab ${activeView === 'history' ? 'active' : ''}`} onClick={() => { setActiveView('history'); setActiveBill(null); }}>
          <ClockIcon size={15} /> Bill History
        </button>
      </div>

      {/* Main Grid */}
      <div className="billing-grid">

        {/* LEFT PANEL */}
        {activeView === 'generate' ? (
          <div className="billing-tables-panel">
            <div className="billing-tables-head">
              Tables Ready to Bill
              <span className="billing-table-count">{billableTables.length} tables</span>
            </div>
            {billableTables.length === 0 ? (
              <div className="billing-empty">
                <div className="billing-empty-icon">🍽️</div>
                No tables with served orders.<br />Orders must be marked "served" first.
              </div>
            ) : (
              billableTables.map(t => (
                <div
                  key={t.table_number}
                  className={`billing-table-row ${selectedTable === t.table_number ? 'active' : ''}`}
                  onClick={() => setSelectedTable(t.table_number)}
                >
                  <div className="billing-table-info">
                    <div className="billing-table-num">Table {t.table_number}</div>
                    <div className="billing-table-meta">{t.orders.length} order{t.orders.length !== 1 ? 's' : ''} • {t.items_count} items</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="billing-table-total">{formatMoney(t.total)}</div>
                    <button
                      className="billing-generate-btn"
                      onClick={(e) => { e.stopPropagation(); handleGenerateBill(t); }}
                      disabled={generating}
                    >
                      {generating ? '...' : 'Generate Bill'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="billing-history">
            <div className="billing-tables-head">
              Bill History
              <span className="billing-table-count">{bills.length} bills</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', padding: '0 16px 12px' }}>
              <button className="billing-export-btn" onClick={() => downloadBillsCSV(bills)}>
                <DownloadIcon size={14} /> CSV
              </button>
              <button className="billing-export-btn" onClick={() => downloadBillsPDF(bills)}>
                <DownloadIcon size={14} /> PDF
              </button>
            </div>
            {bills.length === 0 ? (
              <div className="billing-empty">
                <div className="billing-empty-icon">📋</div>
                No bills generated yet.
              </div>
            ) : (
              bills.map(b => (
                <div
                  key={b.id}
                  className={`billing-history-row ${selectedBill?.id === b.id ? 'active' : ''}`}
                  onClick={() => handleSelectBillHistory(b)}
                >
                  <div className="billing-history-info">
                    <div className="billing-history-id">Bill #{b.id}</div>
                    <div className="billing-history-meta">
                      Table {b.table_number} • {new Date(b.createdAt).toLocaleDateString()} {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="billing-history-right">
                    <span className="billing-history-amt">{formatMoney(b.total)}</span>
                    <span className={`billing-status ${b.payment_status}`}>{b.payment_status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* RIGHT PANEL — Bill Detail */}
        <div className="billing-detail">
          {!activeBill ? (
            <div className="billing-detail-card">
              <div className="billing-detail-placeholder">
                <ReceiptIcon size={48} />
                <p>{activeView === 'generate' ? 'Click "Generate Bill" on a table to create a bill' : 'Select a bill from the list to view details'}</p>
              </div>
            </div>
          ) : (
            <div className="billing-detail-card">
              {/* Header */}
              <div className="billing-detail-head">
                <div>
                  <div className="billing-detail-title">Bill #{activeBill.id}</div>
                  <div className="billing-detail-sub">
                    Table {activeBill.table_number} • {new Date(activeBill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`billing-status ${activeBill.payment_status}`}>
                  {activeBill.payment_status}
                </span>
              </div>

              {/* Items */}
              <div className="billing-section-title">Items Ordered</div>
              <div className="billing-items">
                {billItems.map(item => (
                  <div key={item.id} className="billing-item">
                    <div className="billing-item-left">
                      <span className="billing-item-qty">{item.quantity}</span>
                      <span className="billing-item-name">{item.name}</span>
                    </div>
                    <span className="billing-item-price">{formatMoney(item.line_total)}</span>
                  </div>
                ))}
              </div>

              {/* Controls (only if unpaid) */}
              {activeBill.payment_status !== 'paid' && (
                <div className="billing-controls">
                  <div className="billing-control">
                    <label>Tax Rate</label>
                    <select value={taxRate} onChange={e => { setTaxRate(Number(e.target.value)); }}>
                      {TAX_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="billing-control">
                    <label>Tip</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={tipAmount}
                      onChange={e => setTipAmount(e.target.value)}
                    />
                  </div>
                  <div className="billing-control">
                    <label>Discount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={discountAmount}
                      onChange={e => setDiscountAmount(e.target.value)}
                    />
                  </div>
                  <div className="billing-control">
                    <label>&nbsp;</label>
                    <button className="billing-generate-btn" style={{ height: '38px', width: '100%' }} onClick={handleUpdateBill}>
                      Update Bill
                    </button>
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="billing-totals">
                <div className="billing-total-row">
                  <span>Subtotal</span>
                  <span className="value">{formatMoney(computedSubtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="billing-total-row">
                    <span>Tax ({taxRate}%)</span>
                    <span className="value">{formatMoney(computedTax)}</span>
                  </div>
                )}
                {computedTip > 0 && (
                  <div className="billing-total-row">
                    <span>Tip</span>
                    <span className="value">{formatMoney(computedTip)}</span>
                  </div>
                )}
                {computedDiscount > 0 && (
                  <div className="billing-total-row discount">
                    <span>Discount</span>
                    <span className="value">-{formatMoney(computedDiscount)}</span>
                  </div>
                )}
                <div className="billing-total-row grand">
                  <span>Total</span>
                  <span className="value">{formatMoney(activeBill.payment_status === 'paid' ? activeBill.total : computedTotal)}</span>
                </div>
              </div>

              {/* Payment or Paid Stamp */}
              {activeBill.payment_status === 'paid' ? (
                <>
                  <div className="billing-paid-stamp">
                    <div className="billing-paid-check"><CheckIcon size={24} /></div>
                    <div className="billing-paid-text">Payment Received</div>
                    <div className="billing-paid-method">Paid via {activeBill.payment_method}</div>
                  </div>
                  <div className="billing-actions">
                    <button className="billing-action-btn" onClick={() => handlePrintReceipt(activeBill.id)}>
                      <PrinterIcon size={15} /> Print Receipt
                    </button>
                  </div>
                </>
              ) : (
                <div className="billing-payment">
                  <div className="billing-payment-label">Payment Method</div>
                  <div className="billing-payment-methods">
                    {PAYMENT_METHODS.map(m => (
                      <button
                        key={m.id}
                        className={`billing-pay-method ${paymentMethod === m.id ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(m.id)}
                      >
                        <span className="emoji">{m.emoji}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <button
                    className="billing-confirm-pay"
                    onClick={handlePayBill}
                    disabled={paying || !paymentMethod}
                  >
                    <CheckIcon size={18} />
                    {paying ? 'Processing...' : `Record Payment — ${formatMoney(computedTotal)}`}
                  </button>
                  <div className="billing-actions">
                    <button className="billing-action-btn" onClick={() => handlePrintReceipt(activeBill.id)}>
                      <PrinterIcon size={15} /> Print Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pretext Canvas Receipt Modal */}
      {receiptData && (
        <PretextReceipt billData={receiptData} onClose={() => setReceiptData(null)} />
      )}
    </div>
  );
};

export default Billing;
