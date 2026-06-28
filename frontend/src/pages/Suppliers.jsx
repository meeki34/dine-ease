import { useEffect, useState } from 'react';
import API from '../api/axios';
import { PlusIcon } from '../components/icons';
import '../styles/Suppliers.css';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ 
    name: '', 
    contact_name: '', 
    email: '', 
    phone: '', 
    address: '', 
    payment_terms: 'Net 30' 
  });

  const load = async () => {
    const res = await API.get('/suppliers');
    setSuppliers(res.data?.data || []);
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
        setError(err.response?.data?.message || 'Failed to load suppliers');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const openCreate = () => {
    setFormError('');
    setForm({ name: '', contact_name: '', email: '', phone: '', address: '', payment_terms: 'Net 30' });
    setShowModal(true);
  };

  const closeCreate = () => setShowModal(false);

  const submitCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) return setFormError('Name is required');

    setCreating(true);
    try {
      await API.post('/suppliers', form);
      await load();
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create supplier');
    } finally {
      setCreating(false);
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await API.delete(`/suppliers/${id}`);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete supplier');
    }
  };

  return (
    <div className="sup-page">
      <div className="sup-head">
        <div>
          <h1>Suppliers</h1>
          <p>Manage your ingredient sources and vendor contacts.</p>
        </div>
        <button className="sup-add" type="button" onClick={openCreate}>
          <PlusIcon /> Add Supplier
        </button>
      </div>

      {error && <div className="sup-error">{error}</div>}

      {loading ? (
        <div className="sup-loading">Loading suppliers...</div>
      ) : suppliers.length === 0 ? (
        <div className="sup-empty">No suppliers found. Let's add your first one.</div>
      ) : (
        <div className="sup-grid">
          {suppliers.map((s) => (
            <div className="sup-card" key={s.id}>
              <div className="sup-card-head">
                <div className="sup-name">{s.name}</div>
                <button className="sup-del" onClick={() => deleteSupplier(s.id)}>✕</button>
              </div>
              <div className="sup-body">
                <div className="sup-info">
                  <strong>Contact:</strong> {s.contact_name || '—'}
                </div>
                <div className="sup-info">
                  <strong>Email:</strong> {s.email || '—'}
                </div>
                <div className="sup-info">
                  <strong>Phone:</strong> {s.phone || '—'}
                </div>
                <div className="sup-info">
                  <strong>Terms:</strong> {s.payment_terms || '—'}
                </div>
              </div>
              <div className="sup-footer">
                {s.Ingredients?.length || 0} ingredients linked
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="sup-modal-overlay" onClick={closeCreate}>
          <div className="sup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sup-modal-head">
              <h2>Add New Supplier</h2>
              <button onClick={closeCreate}>✕</button>
            </div>
            {formError && <div className="sup-form-error">{formError}</div>}
            <form onSubmit={submitCreate}>
              <div className="sup-field">
                <label>Supplier Name</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Fresh Produce Co."
                  required
                />
              </div>
              <div className="sup-field">
                <label>Contact Person</label>
                <input 
                  value={form.contact_name} 
                  onChange={(e) => setForm({...form, contact_name: e.target.value})} 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="sup-field-row">
                <div className="sup-field">
                  <label>Email</label>
                  <input 
                    type="email"
                    value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})} 
                    placeholder="john@example.com"
                  />
                </div>
                <div className="sup-field">
                  <label>Phone</label>
                  <input 
                    value={form.phone} 
                    onChange={(e) => setForm({...form, phone: e.target.value})} 
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div className="sup-field">
                <label>Payment Terms</label>
                <select 
                  value={form.payment_terms} 
                  onChange={(e) => setForm({...form, payment_terms: e.target.value})}
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Net 7">Net 7</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Prepaid">Prepaid</option>
                </select>
              </div>
              <div className="sup-modal-actions">
                <button type="button" className="sup-btn ghost" onClick={closeCreate}>Cancel</button>
                <button type="submit" className="sup-btn primary" disabled={creating}>
                  {creating ? 'Saving...' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
