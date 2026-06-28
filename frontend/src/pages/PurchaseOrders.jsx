import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { initSocket, disconnectSocket } from '../api/socket';
import '../styles/PurchaseOrders.css';

const PurchaseOrders = () => {
  const { user } = useAuth();
  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    supplier_id: '',
    items: [{ ingredient_id: '', quantity: 1, unit_price: 0 }],
    notes: ''
  });

  const load = async () => {
    const [poRes, supRes, ingRes] = await Promise.all([
      API.get('/pos'),
      API.get('/suppliers'),
      API.get('/inventory/ingredients')
    ]);
    setPOs(poRes.data?.data || []);
    setSuppliers(supRes.data?.data || []);
    setIngredients(ingRes.data?.data || []);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        await load();
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Failed to load purchase orders');
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

    const handleUpdate = () => {
      load();
    };

    socket.on('po_updated', handleUpdate);

    return () => {
      disconnectSocket();
    };
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/pos/${id}/status`, { status });
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update PO status');
    }
  };

  const openCreate = () => {
    setFormError('');
    setForm({
      supplier_id: '',
      items: [{ ingredient_id: '', quantity: 1, unit_price: 0 }],
      notes: ''
    });
    setShowModal(true);
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { ingredient_id: '', quantity: 1, unit_price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.supplier_id) return setFormError('Supplier is required');
    if (form.items.some(item => !item.ingredient_id || item.quantity <= 0)) {
      return setFormError('All items must have an ingredient and quantity > 0');
    }

    setCreating(true);
    try {
      await API.post('/pos', form);
      await load();
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create PO');
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#f39c12';
      case 'sent': return '#3498db';
      case 'received': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="po-page">
      <div className="po-head">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1>Purchase Orders</h1>
            <p>Manage reorders and automated stock replenishment.</p>
          </div>
          <button className="po-btn primary" onClick={openCreate} style={{ height: '44px', padding: '0 20px' }}>
            Create Purchase Order
          </button>
        </div>
      </div>

      {error && <div className="po-error">{error}</div>}

      {loading ? (
        <div className="po-loading">Loading POs...</div>
      ) : pos.length === 0 ? (
        <div className="po-empty">No purchase orders found. They will appear here when stock is low.</div>
      ) : (
        <div className="po-table-container">
          <table className="po-table">
            <thead>
              <tr>
                <th>PO #</th>
                <th>Supplier</th>
                <th>Amount</th>
                <th>Status</th>
                <th>DateCreated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pos.map((po) => (
                <tr key={po.id}>
                  <td><strong>{po.po_number}</strong></td>
                  <td>{po.Supplier?.name}</td>
                  <td>${Number(po.total_amount).toFixed(2)}</td>
                  <td>
                    <span className="po-status" style={{ backgroundColor: `${getStatusColor(po.status)}22`, color: getStatusColor(po.status), border: `1px solid ${getStatusColor(po.status)}44` }}>
                      {po.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(po.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="po-actions">
                      {po.status === 'draft' && (
                        <button className="po-btn primary" onClick={() => updateStatus(po.id, 'sent')}>Mark Sent</button>
                      )}
                      {po.status === 'sent' && (
                        <button className="po-btn success" onClick={() => updateStatus(po.id, 'received')}>Mark Received</button>
                      )}
                      {po.status !== 'received' && po.status !== 'cancelled' && (
                        <button className="po-btn danger" onClick={() => updateStatus(po.id, 'cancelled')}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="po-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="po-modal" onClick={(e) => e.stopPropagation()}>
            <div className="po-modal-head">
              <h2>New Purchase Order</h2>
              <button className="po-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {formError && <div className="po-form-error">{formError}</div>}

            <form onSubmit={submitCreate}>
              <div className="po-field">
                <label>Supplier</label>
                <select 
                  value={form.supplier_id} 
                  onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="po-field">
                <label>Notes (optional)</label>
                <textarea 
                  value={form.notes} 
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional instructions..."
                />
              </div>

              <div className="po-items-list">
                <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Items</label>
                {form.items.map((item, index) => (
                  <div key={index} className="po-item-row">
                    <select 
                      value={item.ingredient_id} 
                      onChange={(e) => updateItem(index, 'ingredient_id', e.target.value)}
                      required
                    >
                      <option value="">Select Ingredient</option>
                      {ingredients.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      min="1"
                      required
                    />
                    <input 
                      type="number" 
                      value={item.unit_price} 
                      onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                      placeholder="Price"
                      step="0.01"
                      min="0"
                      required
                    />
                    <button 
                      type="button" 
                      className="po-btn danger" 
                      onClick={() => removeItem(index)}
                      style={{ padding: '8px' }}
                      disabled={form.items.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className="po-add-item-btn" onClick={addItem}>
                  + Add Item
                </button>
              </div>

              <div className="po-modal-actions">
                <button type="button" className="po-btn ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="po-btn primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create PO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
