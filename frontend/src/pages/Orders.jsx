import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import { ClipboardIcon, PlusIcon, SearchIcon } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/money';
import { initSocket, disconnectSocket } from '../api/socket';
import '../styles/Orders.css';

const statusOrder = ['pending', 'preparing', 'ready', 'served', 'cancelled'];

const Orders = () => {
  const { user } = useAuth();
  const canCreate = user?.role === 'admin' || user?.role === 'manager';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createForm, setCreateForm] = useState({
    table_number: '',
    notes: '',
    items: [], // {menu_item_id, quantity}
  });

  const loadOrders = async () => {
    try {
      const res = await API.get('/orders');
      const list = res.data?.data || [];
      setOrders(list);
      if (!selectedId && list[0]?.id) setSelectedId(list[0].id);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
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
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WebSocket Integration
  useEffect(() => {
    if (!user?.tenant_id) return;

    const socket = initSocket(user.tenant_id);

    const handleUpdate = () => {
      console.log('Real-time orders update received');
      loadOrders();
    };

    socket.on('order_created', handleUpdate);
    socket.on('order_updated', handleUpdate);
    socket.on('order_deleted', handleUpdate);

    socket.on('menu_updated', () => {
      API.get('/menu').then(res => setMenuItems(res.data?.data || [])).catch(() => {});
    });

    return () => {
      disconnectSocket();
    };
  }, [user]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o?.status === 'pending').length;
    const preparing = orders.filter((o) => o?.status === 'preparing').length;
    const active = pending + preparing;
    return { total, pending, preparing, active };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders || [])
      .filter((o) => (filter === 'all' ? true : o?.status === filter))
      .filter((o) => {
        if (!q) return true;
        return (
          String(o?.id || '').includes(q) ||
          String(o?.table_number || '').includes(q) ||
          String(o?.status || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const ai = statusOrder.indexOf(a?.status);
        const bi = statusOrder.indexOf(b?.status);
        if (ai !== bi) return ai - bi;
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      });
  }, [orders, filter, query]);

  const selected = useMemo(() => orders.find((o) => o?.id === selectedId) || null, [orders, selectedId]);

  const openCreate = async () => {
    setShowModal(true);
    setCreating(false);
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
    setCreateForm((prev) => {
      const exists = prev.items.find((i) => i.menu_item_id === menu_item_id);
      if (exists) {
        return { ...prev, items: prev.items.filter((i) => i.menu_item_id !== menu_item_id) };
      }
      return { ...prev, items: [...prev.items, { menu_item_id, quantity: 1 }] };
    });
  };

  const setQty = (menu_item_id, quantity) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.menu_item_id === menu_item_id ? { ...i, quantity: quantity === '' ? '' : Math.max(1, Number(quantity)) } : i
      ),
    }));
  };

  const createTotal = useMemo(() => {
    const byId = new Map((menuItems || []).map((m) => [m.id, m]));
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
      const res = await API.post('/orders', {
        table_number,
        notes: createForm.notes?.trim() || '',
        items: createForm.items,
      });
      await loadOrders();
      const created = res.data?.data;
      if (created?.id) setSelectedId(created.id);
      setShowModal(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusActions = useMemo(() => {
    if (!selected) return [];
    const s = selected.status;
    const common = [
      { to: 'preparing', label: 'Preparing' },
      { to: 'ready', label: 'Ready' },
      { to: 'served', label: 'Served' },
    ];

    if (user?.role === 'chef') {
      if (s === 'pending') return [{ to: 'preparing', label: 'Start' }, { to: 'ready', label: 'Ready' }];
      if (s === 'preparing') return [{ to: 'ready', label: 'Ready' }];
      return [];
    }

    const actions = common.filter((a) => a.to !== s);
    if (s !== 'cancelled') actions.push({ to: 'cancelled', label: 'Cancel', danger: true });
    return actions;
  }, [selected, user?.role]);

  const selectedItems = selected?.OrderItems || [];
  const selectedCount = selectedItems.reduce((sum, i) => sum + Number(i?.quantity || 0), 0);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Track and manage the full order lifecycle.</p>
        </div>
        {canCreate && (
          <button className="orders-new" onClick={openCreate}>
            <span className="orders-ico" aria-hidden="true">
              <PlusIcon />
            </span>
            New Order
          </button>
        )}
      </div>

      {error && <div className="orders-error">{error}</div>}

      <div className="orders-stats">
        <div className="orders-stat">
          <span className="orders-stat-ico" aria-hidden="true">
            <ClipboardIcon />
          </span>
          <div>
            <div className="orders-stat-val">{stats.total}</div>
            <div className="orders-stat-label">Total Orders</div>
          </div>
        </div>
        <div className="orders-stat">
          <div>
            <div className="orders-stat-val">{stats.active}</div>
            <div className="orders-stat-label">Active</div>
          </div>
        </div>
        <div className="orders-stat">
          <div>
            <div className="orders-stat-val">{stats.pending}</div>
            <div className="orders-stat-label">Pending</div>
          </div>
        </div>
        <div className="orders-stat">
          <div>
            <div className="orders-stat-val">{stats.preparing}</div>
            <div className="orders-stat-label">Preparing</div>
          </div>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="orders-search">
          <span className="orders-search-ico" aria-hidden="true">
            <SearchIcon />
          </span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders…" />
        </div>
        <div className="orders-filters" role="tablist" aria-label="Order status filters">
          {['all', 'pending', 'preparing', 'ready', 'served', 'cancelled'].map((s) => (
            <button
              key={s}
              type="button"
              className={`orders-filter ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="orders-loading">Loading orders…</div>
      ) : (
        <div className="orders-grid">
          <section className="orders-list">
            {filtered.length === 0 ? (
              <div className="orders-empty">No orders found.</div>
            ) : (
              filtered.map((o) => {
                const itemCount = (o?.OrderItems || []).reduce((sum, i) => sum + Number(i?.quantity || 0), 0);
                const active = o.id === selectedId;
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`orders-row ${active ? 'active' : ''}`}
                    onClick={() => setSelectedId(o.id)}
                  >
                    <div className="orders-row-top">
                      <div className="orders-row-title">
                        <span className="orders-row-id">Order #{o.id}</span>
                        <span className={`orders-status ${o.status}`}>{o.status}</span>
                      </div>
                      <div className="orders-row-amt">{formatMoney(o.total_amount)}</div>
                    </div>
                    <div className="orders-row-sub">
                      <span>Table {o.table_number}</span>
                      <span>•</span>
                      <span>{itemCount} items</span>
                      <span>•</span>
                      <span>
                        {o.createdAt
                          ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </section>

          <aside className="orders-detail">
            {!selected ? (
              <div className="orders-empty">Select an order to view details.</div>
            ) : (
              <div className="orders-detail-card">
                <div className="orders-detail-head">
                  <div>
                    <div className="orders-detail-title">Order #{selected.id}</div>
                    <div className="orders-detail-sub">
                      Table {selected.table_number} • {selectedCount} items •{' '}
                      {formatMoney(selected.total_amount)}
                    </div>
                  </div>
                  <span className={`orders-status big ${selected.status}`}>{selected.status}</span>
                </div>

                {selected.notes ? <div className="orders-notes">{selected.notes}</div> : null}

                <div className="orders-items">
                  <div className="orders-items-title">Items</div>
                  {selectedItems.length === 0 ? (
                    <div className="orders-empty">No items.</div>
                  ) : (
                    selectedItems.map((it) => (
                      <div className="orders-item" key={it.id || it.menu_item_id}>
                        <div className="orders-item-left">
                          <span className="orders-qty">{it.quantity}×</span>
                          <div className="orders-item-meta">
                            <div className="orders-item-name">{it?.MenuItem?.name || 'Item'}</div>
                            <div className="orders-item-sub">{it?.MenuItem?.category || ''}</div>
                          </div>
                        </div>
                        <div className="orders-item-price">{formatMoney(Number(it.price || 0) * Number(it.quantity || 1))}</div>
                      </div>
                    ))
                  )}
                </div>

                {statusActions.length > 0 && (
                  <div className="orders-actions">
                    {statusActions.map((a) => (
                      <button
                        key={a.to}
                        type="button"
                        className={`orders-action-btn ${a.danger ? 'danger' : ''}`}
                        onClick={() => updateStatus(selected.id, a.to)}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}

      {showModal && (
        <div className="orders-modal-overlay" onClick={closeCreate}>
          <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
            <div className="orders-modal-head">
              <h2>New Order</h2>
              <button type="button" className="orders-modal-close" onClick={closeCreate}>
                ✕
              </button>
            </div>

            {createError && <div className="orders-form-error">{createError}</div>}

            <form onSubmit={submitCreate}>
              <div className="orders-field-row">
                <div className="orders-field">
                  <label>Table Number</label>
                  <input
                    value={createForm.table_number}
                    onChange={(e) => setCreateForm({ ...createForm, table_number: e.target.value })}
                    placeholder="e.g. 12"
                    required
                    inputMode="numeric"
                  />
                </div>
                <div className="orders-field">
                  <label>Total</label>
                  <input value={formatMoney(createTotal)} readOnly />
                </div>
              </div>

              <div className="orders-field">
                <label>Notes</label>
                <textarea
                  rows={2}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="Optional notes for kitchen…"
                />
              </div>

              <div className="orders-pick">
                <div className="orders-pick-head">
                  <span>Select items</span>
                  <span className="orders-pick-sub">{createForm.items.length} selected</span>
                </div>
                <div className="orders-pick-list">
                  {menuItems.length === 0 ? (
                    <div className="orders-empty">No menu items available.</div>
                  ) : (
                    menuItems.map((m) => {
                      const selectedRow = createForm.items.find((i) => i.menu_item_id === m.id);
                      return (
                        <div className={`orders-pick-row ${selectedRow ? 'selected' : ''}`} key={m.id}>
                          <button type="button" className="orders-pick-toggle" onClick={() => toggleItem(m.id)}>
                            <span className="orders-pick-name">{m.name}</span>
                            <span className="orders-pick-meta">
                              {m.category} • {formatMoney(m.price)}
                            </span>
                          </button>
                          {selectedRow && (
                            <input
                              className="orders-pick-qty"
                              type="number"
                              min="1"
                              step="1"
                              value={selectedRow.quantity}
                              onChange={(e) => setQty(m.id, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="orders-modal-actions">
                <button type="button" className="orders-cancel" onClick={closeCreate}>
                  Cancel
                </button>
                <button type="submit" className="orders-save" disabled={creating}>
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

export default Orders;
