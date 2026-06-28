import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import { ClipboardIcon, PlusIcon, CheckIcon, ClockIcon, BoltIcon, ReceiptIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/money';
import { initSocket, disconnectSocket } from '../api/socket';
import '../styles/Waiter.css';

const STATUS_COLORS = {
  pending:   { label: 'Pending',   cls: 'pending' },
  preparing: { label: 'Preparing', cls: 'preparing' },
  ready:     { label: 'Ready',     cls: 'ready' },
};

const Waiter = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createForm, setCreateForm] = useState({ table_number: '', notes: '', items: [] });

  const loadOrders = async () => {
    const res = await API.get('/orders');
    setOrders(res.data?.data || []);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        await loadOrders();
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!user?.tenant_id) return;
    const socket = initSocket(user.tenant_id);
    const handleOrderUpdate = () => loadOrders();
    const handleMenuUpdate = () => {
      API.get('/menu').then(res => setMenuItems(res.data?.data || [])).catch(() => {});
    };
    socket.on('order_created', handleOrderUpdate);
    socket.on('order_updated', handleOrderUpdate);
    socket.on('order_deleted', handleOrderUpdate);
    socket.on('menu_updated', handleMenuUpdate);
    return () => { disconnectSocket(); };
  }, [user]);

  const activeOrders = useMemo(
    () => (orders || []).filter(o => ['pending', 'preparing', 'ready'].includes(o?.status)),
    [orders]
  );

  const openCreate = async () => {
    setShowModal(true);
    setCreateError('');
    setCreateForm({ table_number: '', notes: '', items: [] });
    try {
      const res = await API.get('/menu');
      setMenuItems(res.data?.data || []);
    } catch (err) {
      setMenuItems([]);
      setCreateError(err.response?.data?.message || 'Failed to load menu items');
    }
  };

  const closeCreate = () => {
    setShowModal(false);
    setCreateError('');
  };

  const toggleItem = (menu_item_id) => {
    setCreateForm(prev => {
      const exists = prev.items.find(i => i.menu_item_id === menu_item_id);
      if (exists) return { ...prev, items: prev.items.filter(i => i.menu_item_id !== menu_item_id) };
      return { ...prev, items: [...prev.items, { menu_item_id, quantity: 1 }] };
    });
  };

  const setQty = (menu_item_id, quantity) => {
    setCreateForm(prev => ({
      ...prev,
      items: prev.items.map(i =>
        i.menu_item_id === menu_item_id ? { ...i, quantity: quantity === '' ? '' : Math.max(1, Number(quantity)) } : i
      ),
    }));
  };

  const total = useMemo(() => {
    const byId = new Map((menuItems || []).map(m => [m.id, m]));
    return (createForm.items || []).reduce((sum, i) => {
      const m = byId.get(i.menu_item_id);
      return sum + Number(m?.price || 0) * Number(i.quantity || 1);
    }, 0);
  }, [createForm.items, menuItems]);

  const submitCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    const table_number = Number(createForm.table_number);
    if (!Number.isFinite(table_number) || table_number <= 0) return setCreateError('Table number is invalid');
    if (!createForm.items.length) return setCreateError('Select at least 1 menu item');
    setCreating(true);
    try {
      await API.post('/orders', {
        table_number,
        notes: createForm.notes?.trim() || '',
        items: createForm.items,
      });
      await loadOrders();
      setShowModal(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setCreating(false);
    }
  };

  const markServed = async (id) => {
    try {
      await API.put(`/orders/${id}/status`, { status: 'served' });
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="waiter-page">
      <div className="waiter-header">
        <div>
          <h1>Order Tickets</h1>
          <p>Track active orders and mark them served when delivered.</p>
        </div>
        <button className="waiter-new" onClick={openCreate}>
          <PlusIcon size={18} />
          New Order
        </button>
      </div>

      {error && <div className="waiter-error">{error}</div>}

      {loading ? (
        <div className="waiter-loading">Loading…</div>
      ) : activeOrders.length === 0 ? (
        <div className="waiter-empty-state">
          <ReceiptIcon size={40} />
          <p>No active orders right now.</p>
        </div>
      ) : (
        <div className="waiter-list">
          {activeOrders.map(o => {
            const st = STATUS_COLORS[o.status] || { label: o.status, cls: o.status };
            const itemCount = (o?.OrderItems || []).reduce((s, it) => s + Number(it?.quantity || 0), 0);

            return (
              <div className={`waiter-card waiter-card--${st.cls}`} key={o.id}>
                {/* Card Header */}
                <div className="waiter-card-head">
                  <div className="waiter-card-id">
                    <ClipboardIcon size={16} />
                    Order #{o.id}
                  </div>
                  <span className={`waiter-badge waiter-badge--${st.cls}`}>{st.label}</span>
                </div>

                {/* Subtitle */}
                <div className="waiter-card-sub">
                  Table {o.table_number} • {itemCount} item{itemCount !== 1 ? 's' : ''} • {formatMoney(o.total_amount)}
                </div>

                {/* Items Section */}
                <div className="waiter-items-section">
                  <div className="waiter-items-label">ITEMS</div>
                  <div className="waiter-items-list">
                    {(o.OrderItems || []).map((item, idx) => (
                      <div className="waiter-item-row" key={idx}>
                        <div className="waiter-item-left">
                          <span className="waiter-item-qty">{item.quantity}×</span>
                          <div className="waiter-item-info">
                            <span className="waiter-item-name">{item.MenuItem?.name || 'Item'}</span>
                            {item.MenuItem?.category && (
                              <span className="waiter-item-cat">{item.MenuItem.category}</span>
                            )}
                          </div>
                        </div>
                        <span className="waiter-item-price">
                          {formatMoney(Number(item.price || item.MenuItem?.price || 0) * Number(item.quantity || 1))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="waiter-card-actions">
                  {o.status === 'ready' ? (
                    <button
                      className="waiter-btn waiter-btn--served"
                      onClick={() => markServed(o.id)}
                    >
                      <CheckIcon size={16} />
                      Mark Served
                    </button>
                  ) : (
                    <button className="waiter-btn waiter-btn--waiting" disabled>
                      <ClockIcon size={16} />
                      {o.status === 'pending' ? 'Waiting for Kitchen' : 'In Preparation'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Order Modal */}
      {showModal && (
        <div className="waiter-modal-overlay" onClick={closeCreate}>
          <div className="waiter-modal" onClick={e => e.stopPropagation()}>
            <div className="waiter-modal-head">
              <h2>New Order</h2>
              <button type="button" className="waiter-modal-close" onClick={closeCreate}>✕</button>
            </div>

            {createError && <div className="waiter-form-error">{createError}</div>}

            <form onSubmit={submitCreate}>
              <div className="waiter-field-row">
                <div className="waiter-field">
                  <label>Table Number</label>
                  <input
                    value={createForm.table_number}
                    onChange={e => setCreateForm({ ...createForm, table_number: e.target.value })}
                    required
                    inputMode="numeric"
                    placeholder="e.g. 12"
                  />
                </div>
                <div className="waiter-field">
                  <label>Total</label>
                  <input value={formatMoney(total)} readOnly />
                </div>
              </div>

              <div className="waiter-field">
                <label>Notes</label>
                <textarea
                  rows={2}
                  value={createForm.notes}
                  onChange={e => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="Optional notes…"
                />
              </div>

              <div className="waiter-pick">
                <div className="waiter-pick-head">
                  <span>Select items</span>
                  <span className="waiter-pick-sub">{createForm.items.length} selected</span>
                </div>
                <div className="waiter-pick-list">
                  {menuItems.length === 0 ? (
                    <div className="waiter-empty">No menu items available.</div>
                  ) : (
                    menuItems.map(m => {
                      const selectedRow = createForm.items.find(i => i.menu_item_id === m.id);
                      return (
                        <div className={`waiter-pick-row ${selectedRow ? 'selected' : ''}`} key={m.id}>
                          <button type="button" className="waiter-pick-toggle" onClick={() => toggleItem(m.id)}>
                            <span className="waiter-pick-name">{m.name}</span>
                            <span className="waiter-pick-meta">{m.category} • {formatMoney(m.price)}</span>
                          </button>
                          {selectedRow && (
                            <input
                              className="waiter-pick-qty"
                              type="number"
                              min="1"
                              step="1"
                              value={selectedRow.quantity}
                              onChange={e => setQty(m.id, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="waiter-modal-actions">
                <button type="button" className="waiter-cancel" onClick={closeCreate}>Cancel</button>
                <button type="submit" className="waiter-save" disabled={creating}>
                  {creating ? 'Creating…' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Waiter;
