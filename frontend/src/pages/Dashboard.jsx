import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  ClipboardIcon, 
  DollarIcon, 
  UsersIcon, 
  GridIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DotsIcon
} from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/money';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, ordersRes] = await Promise.all([
          API.get('/dashboard'),
          API.get('/orders'),
        ]);
        if (!mounted) return;
        setStats(statsRes.data?.data || null);
        setOrders(ordersRes.data?.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const liveOrders = useMemo(() => {
    return (orders || [])
      .filter((o) => ['pending', 'preparing'].includes(o?.status))
      .slice(0, 5);
  }, [orders]);

  const activity = useMemo(() => {
    return (orders || []).slice(0, 4).map((o) => ({
      id: o.id,
      text: `Order #${o.id} - ${o.status === 'ready' ? 'Ready for Pickup' : o.status === 'preparing' ? 'In Kitchen' : 'New Order'}`,
      sub: `Table ${o.table_number} • ${new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      icon: o.status === 'ready' ? '✓' : '◌'
    }));
  }, [orders]);

  if (loading) return <div className="dashboard-page"><div className="dashboard-loading">Loading premium workspace...</div></div>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}. Here's what's happening today.</p>
      </header>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stats">
        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-card-label">Total Revenue</span>
            <span className="dash-card-icon"><DollarIcon size={18} /></span>
          </div>
          <div className="dash-card-value">{formatMoney(stats?.revenue?.today || 0)}</div>
          <div className={`dash-card-trend ${stats?.trends?.revenue?.direction || 'up'}`}>
            {stats?.trends?.revenue?.direction === 'up' ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
            {stats?.trends?.revenue?.direction === 'up' ? '+' : '-'}{stats?.trends?.revenue?.value || 0}% <span>from yesterday</span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-card-label">Active Orders</span>
            <span className="dash-card-icon"><ClipboardIcon size={18} /></span>
          </div>
          <div className="dash-card-value">{stats?.orders?.today || 0}</div>
          <div className={`dash-card-trend ${stats?.trends?.orders?.direction || 'up'}`}>
            {stats?.trends?.orders?.direction === 'up' ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
            {stats?.trends?.orders?.direction === 'up' ? '+' : '-'}{stats?.trends?.orders?.value || 0}% <span>vs yesterday</span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-card-label">Staff On Duty</span>
            <span className="dash-card-icon"><UsersIcon size={18} /></span>
          </div>
          <div className="dash-card-value">{stats?.staff?.total || 0}</div>
          <div className={`dash-card-trend ${stats?.trends?.staff?.direction || 'up'}`}>
            {stats?.trends?.staff?.direction === 'up' ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
            {stats?.trends?.staff?.value || 0} <span>active</span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-top">
            <span className="dash-card-label">Tables Occupied</span>
            <span className="dash-card-icon"><GridIcon size={18} /></span>
          </div>
          <div className="dash-card-value">
            {stats?.tables?.total > 0 ? Math.round(((stats.tables.total - stats.tables.available) / stats.tables.total) * 100) : 0}%
          </div>
          <div className={`dash-card-trend ${stats?.trends?.tables?.direction || 'up'}`}>
            {stats?.trends?.tables?.direction === 'up' ? <TrendingUpIcon size={14} /> : <TrendingDownIcon size={14} />}
            {stats?.trends?.tables?.direction === 'up' ? '+' : '-'}{stats?.trends?.tables?.value || 0}% <span>occupancy</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>Live Orders</h2>
            <button className="dash-link" onClick={() => navigate('/orders')}>View all</button>
          </div>
          <div className="dash-orders">
            {liveOrders.length === 0 ? (
              <div className="dash-empty">No active orders.</div>
            ) : (
              liveOrders.map((o) => (
                <div className="dash-order" key={o.id}>
                  <div className="dash-order-info">
                    <span className="dash-order-title">Order #{o.id}</span>
                    <span className="dash-order-sub">Table {o.table_number} • {o.items_count || 0} items</span>
                  </div>
                  <div className="dash-order-right">
                    <span className="dash-order-price">{formatMoney(o.total_amount)}</span>
                    <span className={`dash-status ${o.status}`}>{o.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>Recent Activity</h2>
            <DotsIcon size={18} style={{ color: 'var(--text-dim)' }} />
          </div>
          <div className="dash-activity">
            {activity.length === 0 ? (
              <div className="dash-empty">No recent activity.</div>
            ) : (
              activity.map((a, i) => (
                <div className="dash-activity-row" key={i}>
                  <div className="dash-activity-icon">{a.icon}</div>
                  <div className="dash-activity-body">
                    <div className="dash-activity-text">{a.text}</div>
                    <div className="dash-activity-sub">{a.sub}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
