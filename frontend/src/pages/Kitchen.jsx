import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import { initSocket } from '../api/socket';
import PretextOrderBubble from '../components/PretextOrderBubble';
import {
  ClockIcon,
  PlateIcon,
  FlameIcon,
  BoltIcon,
  CheckIcon,
  BellIcon,
  TrendingUpIcon,
} from '../components/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/Kitchen.css';

const formatElapsed = (createdAt) => {
  if (!createdAt) return '0m';
  const parsed = new Date(createdAt);
  if (isNaN(parsed.getTime())) return '0m';
  const ms = Date.now() - parsed.getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 0) return '0m';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m`;
  return `${Math.floor(hrs / 24)}d ${hrs % 24}h`;
};

const getUrgency = (createdAt) => {
  if (!createdAt) return '';
  const mins = (Date.now() - new Date(createdAt).getTime()) / 60000;
  if (mins > 15) return 'danger';
  if (mins > 8) return 'warning';
  return '';
};

const STATUS_META = {
  pending:   { label: 'Pending',   accent: '#48cae4' },
  preparing: { label: 'Preparing', accent: '#c084fc' },
  ready:     { label: 'Ready',     accent: '#2ed573' },
  served:    { label: 'Served',    accent: '#71717a' },
  cancelled: { label: 'Cancelled', accent: '#ff4757' },
};

const Kitchen = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('active');
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedItems, setCompletedItems] = useState(new Set());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadQueue = async () => {
    const res = await API.get('/kitchen');
    if (res.data?.success) setQueue(res.data.data || []);
  };

  const loadHistory = async () => {
    const res = await API.get('/orders');
    if (res.data?.success) {
      const done = (res.data.data || []).filter(o =>
        ['ready', 'served', 'cancelled'].includes(o?.status)
      );
      setHistory(done.slice(0, 20));
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (tab === 'history') await loadHistory();
        else await loadQueue();
      } catch (_) {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [tab]);

  useEffect(() => {
    if (!user?.tenant_id || tab !== 'active') return;
    const socket = initSocket(user.tenant_id);
    const refresh = () => loadQueue();
    socket.on('order_created', refresh);
    socket.on('order_updated', refresh);
    return () => {
      socket.off('order_created', refresh);
      socket.off('order_updated', refresh);
    };
  }, [user?.tenant_id, tab]);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      loadQueue();
    } catch (_) {
      // silent
    }
  };

  const toggleItem = (orderId, idx) => {
    const key = `${orderId}-${idx}`;
    setCompletedItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const stats = useMemo(() => {
    const pending   = queue.filter(o => o.status === 'pending').length;
    const preparing = queue.filter(o => o.status === 'preparing').length;
    let urgent = 0;
    queue.forEach(o => {
      if ((Date.now() - new Date(o.createdAt).getTime()) > 900000) urgent++;
    });
    return { total: queue.length, pending, preparing, urgent };
  }, [queue]);

  const orders = tab === 'active' ? queue : history;

  if (loading) {
    return (
      <div className="kds-page">
        <div className="kds-loading">
          <div className="kds-loading-icon"><FlameIcon size={28} /></div>
          <span>Loading kitchen queue…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="kds-page">
      {/* ── TOPBAR ── */}
      <header className="kds-topbar">
        <div className="kds-brand">
          <div className="kds-brand-icon"><FlameIcon size={26} /></div>
          <div>
            <h1 className="kds-brand-name">Kitchen Display</h1>
            <p className="kds-brand-sub">Live production queue</p>
          </div>
        </div>

        <div className="kds-topbar-right">
          <div className="kds-clock-block">
            <div className="kds-clock">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="kds-date">
              {currentTime.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
          <div className="kds-tabs">
            <button className={`kds-tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
              <PlateIcon size={15} /> Queue
              {stats.total > 0 && <span className="kds-tab-count">{stats.total}</span>}
            </button>
            <button className={`kds-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
              History
            </button>
          </div>
        </div>
      </header>

      {/* ── STATS HUD ── */}
      {tab === 'active' && (
        <div className="kds-statsbar">
          <div className="kds-stat kds-stat--queue">
            <div className="kds-stat-val">{stats.total}</div>
            <div className="kds-stat-info">
              <div className="kds-stat-label">In Queue</div>
              <div className="kds-stat-sub">Active orders</div>
            </div>
            <div className="kds-stat-icon"><PlateIcon size={18} /></div>
          </div>
          <div className="kds-stat kds-stat--pending">
            <div className="kds-stat-val kds-stat-val--blue">{stats.pending}</div>
            <div className="kds-stat-info">
              <div className="kds-stat-label">Pending</div>
              <div className="kds-stat-sub">Awaiting start</div>
            </div>
            <div className="kds-stat-icon"><BoltIcon size={18} /></div>
          </div>
          <div className="kds-stat kds-stat--prep">
            <div className="kds-stat-val kds-stat-val--purple">{stats.preparing}</div>
            <div className="kds-stat-info">
              <div className="kds-stat-label">Preparing</div>
              <div className="kds-stat-sub">On the fire</div>
            </div>
            <div className="kds-stat-icon"><FlameIcon size={18} /></div>
          </div>
          <div className="kds-stat kds-stat--urgent">
            <div className="kds-stat-val kds-stat-val--red">{stats.urgent}</div>
            <div className="kds-stat-info">
              <div className="kds-stat-label">Urgent</div>
              <div className="kds-stat-sub">Over 15 min</div>
            </div>
            <div className="kds-stat-icon"><BellIcon size={18} /></div>
          </div>
        </div>
      )}

      {/* ── CARDS ── */}
      {orders.length === 0 ? (
        <div className="kds-empty">
          <div className="kds-empty-icon"><CheckIcon size={32} /></div>
          <h3>All Clear</h3>
          <p>{tab === 'active' ? 'No active orders in the queue.' : 'No completed orders yet.'}</p>
        </div>
      ) : (
        <div className="kds-orders">
          {orders.map((order) => {
            const statusStr = (order.status || 'pending').toLowerCase();
            const urgency  = getUrgency(order.createdAt);
            const meta     = STATUS_META[statusStr] || STATUS_META.pending;
            const items    = order.OrderItems || [];
            const doneCount = items.filter((_, i) => completedItems.has(`${order.id}-${i}`)).length;
            const progress  = items.length > 0 ? (doneCount / items.length) * 100 : 0;
            const totalQty  = items.reduce((s, it) => s + Number(it?.quantity || 0), 0);

            return (
              <PretextOrderBubble key={order.id} order={order} completedItems={completedItems}>
                <div
                  className={`kds-order-card${urgency === 'danger' ? ' kds-card--danger' : urgency === 'warning' ? ' kds-card--warning' : ''}`}
                  style={{ '--status-accent': meta.accent }}
                >
                  {/* Accent bar */}
                  <div className="kds-accent-bar" />

                  {/* Header */}
                  <div className="kds-order-head">
                    <div className="kds-order-number">#{String(order.id).slice(-3)}</div>
                    <div className="kds-order-head-right">
                      <div className={`kds-timer ${urgency}`}>
                        <ClockIcon size={12} />
                        {formatElapsed(order.createdAt)}
                      </div>
                      <div className="kds-status-pill" style={{ color: meta.accent, borderColor: `${meta.accent}40`, background: `${meta.accent}14` }}>
                        {meta.label}
                      </div>
                    </div>
                  </div>

                  {/* Table & count */}
                  <div className="kds-order-meta">
                    <span className="kds-table-tag">TABLE {order.table_number || '—'}</span>
                    <span className="kds-item-count">{totalQty} item{totalQty !== 1 ? 's' : ''}</span>
                    {order.notes && <span className="kds-note-flag">📝 Note</span>}
                  </div>

                  {/* Progress bar */}
                  {tab === 'active' && items.length > 0 && (
                    <div className="kds-progress-wrap">
                      <div className="kds-progress-bar">
                        <div className="kds-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="kds-progress-text">{doneCount}/{items.length}</span>
                    </div>
                  )}

                  {/* Items */}
                  <div className="kds-items-box">
                    {items.map((item, idx) => {
                      const done = completedItems.has(`${order.id}-${idx}`);
                      return (
                        <div
                          key={idx}
                          className={`kds-item-row${done ? ' done' : ''}`}
                          onClick={() => toggleItem(order.id, idx)}
                        >
                          <div className={`kds-item-check${done ? ' checked' : ''}`}>
                            {done && <CheckIcon size={11} color="black" />}
                          </div>
                          <div className="kds-item-qty">{item.quantity}×</div>
                          <div className="kds-item-info">
                            <span className="kds-item-name">{item.MenuItem?.name || 'Item'}</span>
                            {item.MenuItem?.category && (
                              <span className="kds-item-cat">{item.MenuItem.category}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {order.notes && (
                      <div className="kds-order-notes">
                        <span className="kds-notes-label">Note</span>
                        {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="kds-order-footer">
                    {statusStr === 'pending' ? (
                      <>
                        <button className="kds-btn kds-btn--start" onClick={() => updateStatus(order.id, 'preparing')}>
                          <BoltIcon size={15} /> Start Preparing
                        </button>
                        <button className="kds-btn kds-btn--ready" onClick={() => updateStatus(order.id, 'ready')}>
                          <CheckIcon size={15} /> Ready Dish
                        </button>
                      </>
                    ) : statusStr === 'preparing' ? (
                      <button className="kds-btn kds-btn--ready" onClick={() => updateStatus(order.id, 'ready')}>
                        <CheckIcon size={15} /> Ready Dish
                      </button>
                    ) : statusStr === 'ready' ? (
                      tab === 'active' ? (
                        <button className="kds-btn kds-btn--ready" onClick={() => updateStatus(order.id, 'served')}>
                          <CheckIcon size={15} /> Complete & Serve
                        </button>
                      ) : (
                        <div className="kds-btn kds-btn--done">
                          <CheckIcon size={14} /> Ready for Pickup
                        </div>
                      )
                    ) : (
                      <div className="kds-btn kds-btn--done" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Order {statusStr}
                      </div>
                    )}
                  </div>
                </div>
              </PretextOrderBubble>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Kitchen;
