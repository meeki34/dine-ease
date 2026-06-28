import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import { DollarIcon, PlusIcon } from '../components/icons';
import { formatMoney } from '../utils/money';
import '../styles/Expenses.css';

const todayISO = () => new Date().toISOString().slice(0, 10);

const Expenses = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    amount: '',
    category: 'Food Cost',
    description: '',
    expense_date: todayISO(),
  });

  const load = async () => {
    const res = await API.get('/expenses');
    setItems(res.data?.data || []);
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
        setError(err.response?.data?.message || err.message || 'Failed to load expenses');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = (items || []).reduce((sum, e) => sum + Number(e?.amount || 0), 0);
    const today = todayISO();
    const todayTotal = (items || []).filter((e) => e?.expense_date === today).reduce((sum, e) => sum + Number(e?.amount || 0), 0);
    return { total, todayTotal };
  }, [items]);

  const openCreate = () => {
    setFormError('');
    setForm({ amount: '', category: 'Food Cost', description: '', expense_date: todayISO() });
    setShowModal(true);
  };

  const closeCreate = () => setShowModal(false);

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');

    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return setFormError('Amount must be > 0');
    if (!form.expense_date) return setFormError('Date is required');

    setSaving(true);
    try {
      await API.post('/expenses', {
        amount,
        category: form.category,
        description: form.description?.trim() || '',
        expense_date: form.expense_date,
      });
      await load();
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to add expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="exp-page">
      <div className="exp-head">
        <div>
          <h1>Expenses</h1>
          <p>Track outgoing costs and keep your profit visible.</p>
        </div>
        <button className="exp-add" type="button" onClick={openCreate}>
          <span className="exp-ico" aria-hidden="true">
            <PlusIcon />
          </span>
          Add Expense
        </button>
      </div>

      {error && <div className="exp-error">{error}</div>}

      <div className="exp-stats">
        <div className="exp-stat">
          <span className="exp-stat-ico" aria-hidden="true">
            <DollarIcon />
          </span>
          <div>
            <div className="exp-stat-val">{formatMoney(stats.total)}</div>
            <div className="exp-stat-label">Total Expenses</div>
          </div>
        </div>
        <div className="exp-stat">
          <div>
            <div className="exp-stat-val">{formatMoney(stats.todayTotal)}</div>
            <div className="exp-stat-label">Today</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="exp-loading">Loading...</div>
      ) : items.length === 0 ? (
        <div className="exp-empty">No expenses yet.</div>
      ) : (
        <div className="exp-table">
          <div className="exp-row exp-row-head">
            <div>Date</div>
            <div>Category</div>
            <div>Description</div>
            <div>Amount</div>
          </div>
          {items.map((it) => (
            <div className="exp-row" key={it.id}>
              <div className="exp-muted">{it.expense_date}</div>
              <div className="exp-cat">{it.category}</div>
              <div className="exp-desc">{it.description || '—'}</div>
              <div className="exp-amt">{formatMoney(it.amount)}</div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="exp-modal-overlay" onClick={closeCreate}>
          <div className="exp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exp-modal-head">
              <h2>Add Expense</h2>
              <button type="button" className="exp-modal-close" onClick={closeCreate}>
                ✕
              </button>
            </div>

            {formError && <div className="exp-form-error">{formError}</div>}

            <form onSubmit={submit}>
              <div className="exp-field-row">
                <div className="exp-field">
                  <label>Amount</label>
                  <input
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    inputMode="decimal"
                    placeholder="e.g. 45.50"
                    required
                  />
                </div>
                <div className="exp-field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.expense_date}
                    onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="exp-field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option>Food Cost</option>
                  <option>Labour</option>
                  <option>Utilities</option>
                  <option>Supplies</option>
                  <option>Maintenance</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="exp-field">
                <label>Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional notes"
                />
              </div>
              <div className="exp-modal-actions">
                <button type="button" className="exp-btn ghost" onClick={closeCreate} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="exp-btn primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
