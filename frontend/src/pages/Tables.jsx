import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import API from '../api/axios';
import { GridIcon, PlusIcon, SearchIcon, TrashIcon, UsersIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/Tables.css';

const emptyForm = {
  table_number: '',
  capacity: 4,
  location: '',
  status: 'available',
};

const STATUSES = ['available', 'occupied', 'reserved', 'cleaning'];

const Tables = () => {
  const { user } = useAuth();
  const canCreate = user?.role === 'admin' || user?.role === 'manager';
  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin' || user?.role === 'manager';

  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [qrModalTable, setQrModalTable] = useState(null);

  const openQrModal = (t) => setQrModalTable(t);
  const closeQrModal = () => setQrModalTable(null);

  const load = async () => {
    const res = await API.get('/tables');
    setTables(res.data?.data || []);
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
        setError(err.response?.data?.message || 'Failed to load tables');
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
    const total = tables.length;
    const by = (s) => tables.filter((t) => t?.status === s).length;
    return {
      total,
      available: by('available'),
      occupied: by('occupied'),
      reserved: by('reserved'),
      cleaning: by('cleaning'),
    };
  }, [tables]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (tables || [])
      .filter((t) => (statusFilter === 'all' ? true : t?.status === statusFilter))
      .filter((t) => {
        if (!q) return true;
        return (
          String(t?.table_number || '').includes(q) ||
          String(t?.location || '').toLowerCase().includes(q) ||
          String(t?.status || '').toLowerCase().includes(q)
        );
      });
  }, [tables, query, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      table_number: t?.table_number ?? '',
      capacity: t?.capacity ?? 4,
      location: t?.location || '',
      status: t?.status || 'available',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      table_number: Number(form.table_number),
      capacity: Number(form.capacity),
      location: form.location?.trim() || null,
      status: form.status,
    };

    if (!Number.isFinite(payload.table_number) || payload.table_number <= 0) {
      return setFormError('Table number is invalid');
    }
    if (!Number.isFinite(payload.capacity) || payload.capacity <= 0) {
      return setFormError('Capacity is invalid');
    }
    if (!STATUSES.includes(payload.status)) {
      return setFormError('Status is invalid');
    }

    setSaving(true);
    try {
      if (editing?.id) {
        await API.put(`/tables/${editing.id}`, payload);
      } else {
        await API.post('/tables', payload);
      }
      await load();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await API.delete(`/tables/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const quickStatus = async (t, status) => {
    if (!canEdit) return;
    try {
      await API.put(`/tables/${t.id}`, { status });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="tables-page">
      <div className="tables-header">
        <div>
          <h1>Tables</h1>
          <p>Manage floor availability and table details.</p>
        </div>
        {canCreate && (
          <button className="tables-add" onClick={openAdd}>
            <span className="tables-ico" aria-hidden="true">
              <PlusIcon />
            </span>
            Add Table
          </button>
        )}
      </div>

      {error && <div className="tables-error">{error}</div>}

      <div className="tables-stats">
        <div className="tables-stat">
          <span className="tables-stat-ico" aria-hidden="true">
            <GridIcon />
          </span>
          <div>
            <div className="tables-stat-val">{stats.total}</div>
            <div className="tables-stat-label">Total</div>
          </div>
        </div>
        <div className="tables-stat">
          <div>
            <div className="tables-stat-val">{stats.available}</div>
            <div className="tables-stat-label">Available</div>
          </div>
        </div>
        <div className="tables-stat">
          <div>
            <div className="tables-stat-val">{stats.occupied}</div>
            <div className="tables-stat-label">Occupied</div>
          </div>
        </div>
        <div className="tables-stat">
          <div>
            <div className="tables-stat-val">{stats.reserved}</div>
            <div className="tables-stat-label">Reserved</div>
          </div>
        </div>
        <div className="tables-stat">
          <div>
            <div className="tables-stat-val">{stats.cleaning}</div>
            <div className="tables-stat-label">Cleaning</div>
          </div>
        </div>
      </div>

      <div className="tables-toolbar">
        <div className="tables-search">
          <span className="tables-search-ico" aria-hidden="true">
            <SearchIcon />
          </span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tables…" />
        </div>
        <div className="tables-filter">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="tables-loading">Loading tables…</div>
      ) : filtered.length === 0 ? (
        <div className="tables-empty">No tables found.</div>
      ) : (
        <div className="tables-grid">
          {filtered.map((t) => (
            <div className="table-card" key={t.id}>
              <div className="table-top">
                <div className="table-num">Table {t.table_number}</div>
                <span className={`table-status ${t.status}`}>{t.status}</span>
              </div>

              <div className="table-meta">
                <div className="table-cap">
                  <span className="table-cap-ico" aria-hidden="true">
                    <UsersIcon />
                  </span>
                  Capacity: {t.capacity}
                </div>
                <div className="table-loc">{t.location || '—'}</div>
              </div>

              {canEdit && (
                <div className="table-quick">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`table-quick-btn ${t.status === s ? 'active' : ''}`}
                      onClick={() => quickStatus(t, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="table-actions">
                <button className="table-action" type="button" onClick={() => openQrModal(t)} style={{ color: '#ffb347', borderColor: 'rgba(255,179,71,0.2)' }}>
                  QR Menu
                </button>
                {canEdit && (
                  <button className="table-action" type="button" onClick={() => openEdit(t)}>
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button className="table-action danger" type="button" onClick={() => remove(t.id)}>
                    <span className="tables-ico" aria-hidden="true">
                      <TrashIcon />
                    </span>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {qrModalTable && (
        <div className="tables-modal-overlay" onClick={closeQrModal}>
          <div className="tables-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tables-modal-head">
              <h2>QR Code: Table {qrModalTable.table_number}</h2>
              <button className="tables-modal-close" type="button" onClick={closeQrModal}>✕</button>
            </div>
            <div style={{ padding: '20px', textAlign: 'center', background: '#fff', borderRadius: '12px', margin: '20px', display: 'flex', justifyContent: 'center' }}>
              <QRCodeSVG 
                value={`${window.location.origin}/m/${qrModalTable.tenant_id}/${qrModalTable.table_number}`} 
                size={220} 
                level="H" 
                includeMargin={true} 
              />
            </div>
            <p style={{ textAlign: 'center', color: '#888', marginBottom: '10px', padding: '0 20px' }}>
              Customers can scan this to view the digital menu and place their own orders.
            </p>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <a 
                href={`/m/${qrModalTable.tenant_id}/${qrModalTable.table_number}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  color: '#ffb347',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'rgba(255,179,71,0.1)'
                }}
              >
                Open Direct Link
              </a>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="tables-modal-overlay" onClick={closeModal}>
          <div className="tables-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tables-modal-head">
              <h2>{editing ? 'Edit Table' : 'Add Table'}</h2>
              <button className="tables-modal-close" type="button" onClick={closeModal}>
                ✕
              </button>
            </div>

            {formError && <div className="tables-form-error">{formError}</div>}

            <form onSubmit={submit}>
              <div className="tables-field-row">
                <div className="tables-field">
                  <label>Table Number</label>
                  <input
                    value={form.table_number}
                    onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                    required
                    inputMode="numeric"
                  />
                </div>
                <div className="tables-field">
                  <label>Capacity</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="tables-field-row">
                <div className="tables-field">
                  <label>Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Patio"
                  />
                </div>
                <div className="tables-field">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="tables-modal-actions">
                <button type="button" className="tables-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="tables-save" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;
