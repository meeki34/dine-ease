import { useEffect, useMemo, useState } from 'react';
import API from '../api/axios';
import { downloadCSV, downloadAnalyticsPDF } from '../utils/exportUtils';
import { initSocket, disconnectSocket } from '../api/socket';
import { 
  ChartIcon, 
  DollarIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  BoxIcon,
  UsersIcon,
  DownloadIcon
} from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/money';
import '../styles/Analytics.css';

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(7);

  const load = async (d, silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await API.get(`/analytics?days=${d}`);
      setData(res.data?.data || null);
    } catch (err) {
      if (!silent) setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load(days);
  }, [days]);

  // WebSocket Integration for real-time analytics updates
  useEffect(() => {
    if (!user?.tenant_id) return;

    const socket = initSocket(user.tenant_id);

    const handleUpdate = () => {
      load(days, true);
    };

    socket.on('order_created', handleUpdate);
    socket.on('order_updated', handleUpdate);
    socket.on('order_deleted', handleUpdate);
    socket.on('inventory_update', handleUpdate);
    socket.on('po_updated', handleUpdate);

    return () => {
      disconnectSocket();
    };
  }, [user, days]);

  const totals = useMemo(() => data?.totals || {}, [data]);
  const byDay = useMemo(() => data?.byDay || [], [data]);
  const topItems = useMemo(() => data?.topItems || [], [data]);

  const maxRevenue = useMemo(() => {
    if (!byDay.length) return 1;
    return Math.max(...byDay.map(d => Number(d.revenue || 0)), 1);
  }, [byDay]);

  if (loading) return <div className="an-page"><div className="an-loading">Syncing Analytics Cloud...</div></div>;

  return (
    <div className="an-page">
      <header className="an-head">
        <div>
          <h1>Inventory & COGS</h1>
          <p>Comprehensive financial and operational performance metrics</p>
        </div>
        <div className="an-actions">
          <div className="an-range">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                className={`an-range-btn ${days === d ? 'active' : ''}`}
                onClick={() => setDays(d)}
              >
                {d === 7 ? '7D' : d === 30 ? '30D' : '90D'}
              </button>
            ))}
          </div>
          <button className="an-btn-export" onClick={() => downloadCSV(byDay, 'Revenue_Analytics')}>
            <DownloadIcon size={16} />
            CSV
          </button>
          <button className="an-btn-export" onClick={() => downloadAnalyticsPDF(data, days)}>
            <DownloadIcon size={16} />
            PDF
          </button>
        </div>
      </header>

      {error && <div className="an-error">{error}</div>}

      <div className="an-cards">
        <div className="an-card">
          <div className="an-card-label">Total Revenue</div>
          <div className="an-val">{formatMoney(totals.revenue || 0)}</div>
          <div className="an-card-sub">
            <TrendingUpIcon size={14} style={{ color: 'var(--an-success)' }} /> 12.5% vs last period
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-label">Inventory Cost (COGS)</div>
          <div className="an-val">{formatMoney(totals.cogs || 0)}</div>
          <div className="an-card-sub">
            {totals.revenue > 0 ? (totals.cogs / totals.revenue * 100).toFixed(1) : 0}% of revenue
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-label">Labor Cost</div>
          <div className="an-val">{formatMoney(totals.labor || 0)}</div>
          <div className="an-card-sub">
            {totals.revenue > 0 ? (totals.labor / totals.revenue * 100).toFixed(1) : 0}% of revenue
          </div>
        </div>

        <div className="an-card">
          <div className="an-card-label">Net Profit</div>
          <div className="an-val" style={{ color: totals.profit >= 0 ? 'var(--an-success)' : 'var(--an-danger)' }}>
            {formatMoney(totals.profit || 0)}
          </div>
          <div className="an-card-sub">After all operational expenses</div>
        </div>
      </div>

      <div className="an-grid">
        <section className="an-panel">
          <div className="an-panel-head">
            <h2>Revenue Trends</h2>
            <ChartIcon size={18} style={{ color: 'var(--an-text-muted)' }} />
          </div>
          <div className="an-bars">
            {byDay.map((d, i) => (
              <div className="an-bar" key={i}>
                <div 
                  className="an-bar-rev" 
                  style={{ height: `${(Number(d.revenue || 0) / maxRevenue) * 100}%` }}
                ></div>
                <span className="an-bar-date">{new Date(d.date).toLocaleDateString([], { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="an-panel">
          <div className="an-panel-head">
            <h2>Top Selling Items</h2>
          </div>
          <div className="an-item-list">
            {topItems.length === 0 ? (
              <div className="an-empty">No item data available for this range.</div>
            ) : (
              topItems.map((item, idx) => {
                const maxCount = Math.max(...topItems.map(i => i.count), 1);
                return (
                  <div className="an-item-row" key={idx}>
                    <div className="an-item-info">
                      <span>{item.name}</span>
                      <span className="an-text-muted">{item.count} sold</span>
                    </div>
                    <div className="an-progress-bg">
                      <div 
                        className="an-progress-fill" 
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <section className="an-panel" style={{ marginTop: '24px' }}>
        <div className="an-panel-head">
          <h2>Sales Intensity Heatmap (24h)</h2>
        </div>
        <div className="an-heatmap-grid">
          {new Array(24).fill(0).map((_, h) => (
            <div className="an-hm-label" key={h}>{h}h</div>
          ))}
          <div></div>
          {new Array(24).fill(0).map((_, h) => {
            const hourData = (data?.heatmap || []).find(d => d.hour === h);
            const intensity = hourData ? Math.min(1, hourData.count / 10) : 0;
            return (
              <div 
                className="an-hm-cell" 
                key={h} 
                style={{ background: `rgba(244, 140, 37, ${0.05 + intensity * 0.7})` }}
              ></div>
            );
          })}
        </div>
      </section>

      <div className="an-grid" style={{ marginTop: '24px' }}>
        <section className="an-panel">
          <div className="an-panel-head">
            <h2>Inventory Alerts</h2>
            <BoxIcon size={18} style={{ color: 'var(--an-danger)' }} />
          </div>
          <div className="an-item-list">
            {(data?.lowStock || []).map((item, idx) => (
              <div className="an-item-row" key={idx}>
                <div className="an-item-info">
                  <span style={{ color: 'var(--an-danger)' }}>{item.name}</span>
                  <span className="an-text-muted">{item.current_quantity} {item.unit} left</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--an-text-muted)' }}>
                  Reorder point: {item.low_stock_threshold} {item.unit}
                </div>
              </div>
            ))}
            {(data?.lowStock || []).length === 0 && (
              <div className="an-text-muted">All inventory levels are safe.</div>
            )}
          </div>
        </section>

        <section className="an-panel">
          <div className="an-panel-head">
            <h2>Staff Performance</h2>
            <UsersIcon size={18} style={{ color: 'var(--an-purple)' }} />
          </div>
          <div className="an-item-list">
            {(data?.performance || []).map((perf, idx) => (
              <div className="an-item-row" key={idx}>
                <div className="an-item-info">
                  <span>{perf.User?.name}</span>
                  <span className="an-text-muted">{perf.order_count} orders</span>
                </div>
                <div className="an-progress-bg" style={{ height: '6px' }}>
                  <div 
                    className="an-progress-fill" 
                    style={{ 
                      width: `${Math.min(100, (perf.avg_seconds / 600) * 100)}%`,
                      background: 'var(--an-purple)'
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {(data?.performance || []).length === 0 && (
              <div className="an-text-muted">No performance data yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
