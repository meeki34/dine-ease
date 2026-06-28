import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import { downloadCSV } from '../utils/exportUtils';
import { PlusIcon, DownloadIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { initSocket, disconnectSocket } from '../api/socket';
import '../styles/Inventory.css';

const fmtQty = (value) => {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return '0';
  return n % 1 === 0 ? String(n) : n.toFixed(2);
};

const Inventory = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ 
    name: '', 
    unit: 'pcs', 
    current_quantity: '', 
    low_stock_threshold: '',
    preferred_supplier_id: '',
    last_purchase_price: ''
  });

  const [adjustId, setAdjustId] = useState(null);
  const [adjustType, setAdjustType] = useState('in');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustNote, setAdjustNote] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const [invRes, supRes] = await Promise.all([
      API.get('/inventory/ingredients'),
      API.get('/suppliers')
    ]);
    setIngredients(invRes.data?.data || []);
    setSuppliers(supRes.data?.data || []);
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
        setError(err.response?.data?.message || err.message || 'Failed to load inventory');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.tenant_id) return;

    const socket = initSocket(user.tenant_id);

    const handleUpdate = () => {
      console.log('Real-time inventory update received');
      load();
    };

    socket.on('inventory_update', handleUpdate);

    return () => {
      disconnectSocket();
    };
  }, [user]);

  const lowItems = useMemo(() => {
    return (ingredients || []).filter((i) => Number(i.current_quantity || 0) <= Number(i.low_stock_threshold || 0));
  }, [ingredients]);

  const openCreate = () => {
    setFormError('');
    setEditingId(null);
    setForm({ 
      name: '', 
      unit: 'pcs', 
      current_quantity: '', 
      low_stock_threshold: '',
      preferred_supplier_id: '',
      last_purchase_price: ''
    });
    setShowModal(true);
  };

  const openEdit = (i) => {
    setFormError('');
    setEditingId(i.id);
    setForm({
      name: i.name,
      unit: i.unit,
      current_quantity: i.current_quantity,
      low_stock_threshold: i.low_stock_threshold,
      preferred_supplier_id: i.preferred_supplier_id || '',
      last_purchase_price: i.last_purchase_price || ''
    });
    setShowModal(true);
  };

  const closeCreate = () => setShowModal(false);

  const submitCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) return setFormError('Name is required');

    setCreating(true);
    try {
      const payload = {
        name: form.name.trim(),
        unit: (form.unit || 'pcs').trim(),
        current_quantity: form.current_quantity === '' ? 0 : Number(form.current_quantity),
        low_stock_threshold: form.low_stock_threshold === '' ? 0 : Number(form.low_stock_threshold),
        preferred_supplier_id: form.preferred_supplier_id || null,
        last_purchase_price: form.last_purchase_price === '' ? 0 : Number(form.last_purchase_price),
      };

      if (editingId) {
        await API.put(`/inventory/ingredients/${editingId}`, payload);
      } else {
        await API.post('/inventory/ingredients', payload);
      }

      await load();
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || `Failed to ${editingId ? 'update' : 'create'} ingredient`);
    } finally {
      setCreating(false);
    }
  };

  const startAdjust = (id) => {
    setAdjustId(id);
    setAdjustType('in');
    setAdjustQty('');
    setAdjustNote('');
  };

  const cancelAdjust = () => {
    setAdjustId(null);
    setAdjustQty('');
    setAdjustNote('');
  };

  const submitAdjust = async () => {
    if (!adjustId) return;
    const q = Number(adjustQty);
    if (!Number.isFinite(q) || q <= 0) return setError('Quantity must be > 0');

    setAdjusting(true);
    try {
      await API.post(`/inventory/ingredients/${adjustId}/adjust`, {
        type: adjustType,
        quantity: q,
        note: adjustNote?.trim() || '',
      });
      await load();
      setAdjustId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to adjust stock');
    } finally {
      setAdjusting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await API.delete(`/inventory/ingredients/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete ingredient');
    }
  };

  return (
    <div className="inv-page">
      <div className="inv-head">
        <div>
          <h1>Inventory</h1>
          <p>Track ingredients, stock levels, and low-stock alerts.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="inv-btn secondary" 
            style={{ height: '44px', padding: '0 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => downloadCSV(ingredients, 'Inventory_Stock')}
          >
            <DownloadIcon size={18} />
            Export CSV
          </button>
          <button className="inv-add" type="button" onClick={openCreate}>
            <span className="inv-ico" aria-hidden="true">
              <PlusIcon />
            </span>
            Add Ingredient
          </button>
        </div>
      </div>

      {error && <div className="inv-error">{error}</div>}

      <div className="inv-stats">
        <div className="inv-stat">
          <div className="inv-stat-val">{ingredients.length}</div>
          <div className="inv-stat-label">Ingredients</div>
        </div>
        <div className="inv-stat danger">
          <div className="inv-stat-val">{lowItems.length}</div>
          <div className="inv-stat-label">Low Stock</div>
        </div>
      </div>

      {loading ? (
        <div className="inv-loading">Loading...</div>
      ) : ingredients.length === 0 ? (
        <div className="inv-empty">No ingredients yet. Add your first one.</div>
      ) : (
        <div className="inv-table">
          <div className="inv-row inv-row-head">
            <div>Name</div>
            <div>Unit</div>
            <div>In Stock</div>
            <div>Low At</div>
            <div>Actions</div>
          </div>
          {ingredients.map((i) => {
            const isLow = Number(i.current_quantity || 0) <= Number(i.low_stock_threshold || 0);
            const adjustingThis = adjustId === i.id;
            return (
              <div className={`inv-row ${isLow ? 'low' : ''}`} key={i.id}>
                <div className="inv-name">
                  <div className="inv-name-main">{i.name}</div>
                  {isLow && <div className="inv-badge">Low</div>}
                </div>
                <div className="inv-muted">{i.unit}</div>
                <div className="inv-qty">{fmtQty(i.current_quantity)}</div>
                <div className="inv-muted">{fmtQty(i.low_stock_threshold)}</div>
                <div className="inv-actions">
                  {!adjustingThis ? (
                    <div className="inv-actions-row">
                      <button className="inv-btn secondary" type="button" onClick={() => openEdit(i)}>
                        Edit
                      </button>
                      <button className="inv-btn" type="button" onClick={() => startAdjust(i.id)}>
                        Adjust
                      </button>
                      <button 
                        className="inv-btn danger" 
                        type="button" 
                        onClick={() => handleDelete(i.id, i.name)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="inv-adjust">
                      <select value={adjustType} onChange={(e) => setAdjustType(e.target.value)}>
                        <option value="in">Stock In</option>
                        <option value="out">Stock Out</option>
                        <option value="adjust">Set To</option>
                      </select>
                      <input
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(e.target.value)}
                        inputMode="decimal"
                        placeholder="Qty"
                      />
                      <input
                        value={adjustNote}
                        onChange={(e) => setAdjustNote(e.target.value)}
                        placeholder="Note (optional)"
                      />
                      <button className="inv-btn primary" type="button" onClick={submitAdjust} disabled={adjusting}>
                        {adjusting ? 'Saving...' : 'Save'}
                      </button>
                      <button className="inv-btn ghost" type="button" onClick={cancelAdjust} disabled={adjusting}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="inv-modal-overlay" onClick={closeCreate}>
          <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="inv-modal-head">
              <h2>{editingId ? 'Edit Ingredient' : 'Add Ingredient'}</h2>
              <button type="button" className="inv-modal-close" onClick={closeCreate}>
                ✕
              </button>
            </div>

            {formError && <div className="inv-form-error">{formError}</div>}

            <form onSubmit={submitCreate}>
              <div className="inv-field">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Tomato"
                  required
                />
              </div>
              <div className="inv-field-row">
                <div className="inv-field">
                  <label>Unit</label>
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
                <div className="inv-field">
                  <label>Starting Qty</label>
                  <input
                    value={form.current_quantity}
                    onChange={(e) => setForm({ ...form, current_quantity: e.target.value })}
                    inputMode="decimal"
                    placeholder="0"
                  />
                </div>
                <div className="inv-field">
                  <label>Low At</label>
                  <input
                    value={form.low_stock_threshold}
                    onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })}
                    inputMode="decimal"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="inv-field-row">
                <div className="inv-field">
                  <label>Preferred Supplier</label>
                  <select 
                    value={form.preferred_supplier_id} 
                    onChange={(e) => setForm({ ...form, preferred_supplier_id: e.target.value })}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="inv-field">
                  <label>Last Price</label>
                  <input
                    value={form.last_purchase_price}
                    onChange={(e) => setForm({ ...form, last_purchase_price: e.target.value })}
                    inputMode="decimal"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="inv-modal-actions">
                <button type="button" className="inv-btn ghost" onClick={closeCreate} disabled={creating}>
                  Cancel
                </button>
                <button type="submit" className="inv-btn primary" disabled={creating}>
                  {creating ? (editingId ? 'Saving...' : 'Adding...') : (editingId ? 'Save' : 'Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

