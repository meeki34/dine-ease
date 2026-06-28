import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { 
  ChartIcon, 
  ClipboardIcon, 
  GridIcon, 
  TrendingUpIcon, 
  ClockIcon, 
  BoltIcon,
  CheckIcon,
  BellIcon,
  UsersIcon,
  FlameIcon
} from '../components/icons';
import API from '../api/axios';
import '../styles/EmployeePortal.css';

const EmployeePortal = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Load stats and shifts independently so one failure doesn't break the other
            let myStats = null;
            let myShifts = [];

            try {
                const statsRes = await API.get('/performance/stats');
                myStats = (statsRes.data?.data || []).find(s => String(s.user_id) === String(user.id)) || null;
            } catch (err) {
                console.warn('Stats API unavailable:', err.response?.data?.message || err.message);
            }

            try {
                const shiftsRes = await API.get('/performance/shifts');
                myShifts = (shiftsRes.data?.data || []).filter(s => String(s.user_id) === String(user.id));
            } catch (err) {
                console.warn('Shifts API unavailable:', err.response?.data?.message || err.message);
            }

            setStats(myStats);
            setShifts(myShifts);
            setLoading(false);
        } catch (error) {
            console.error('Portal load failed:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatFulfillmentTime = (seconds) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    const getPerformanceStatus = (avgSeconds) => {
        if (!avgSeconds) return 'PROBATIONARY';
        if (avgSeconds < 300) return 'ELITE'; // < 5m
        if (avgSeconds < 600) return 'TOP TIER'; // < 10m
        return 'STANDARD';
    };

    const upcomingShifts = useMemo(() => {
        return shifts
            .filter(s => new Date(s.start_time) > new Date())
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .slice(0, 5);
    }, [shifts]);

    const speedScore = useMemo(() => {
        if (!stats?.avg_seconds) return 0;
        // Target is 10 mins (600s). Score = 100 - (seconds / 600 * 100)
        // If they are 5 mins (300s), score is 50. 
        // Let's use a simpler mapping: 600s or more is 0%, 120s or less is 100%
        const min = 120;
        const max = 900;
        const score = 100 - ((Math.min(Math.max(stats.avg_seconds, min), max) - min) / (max - min) * 100);
        return Math.round(score);
    }, [stats]);

    if (loading) {
        return (
            <div className="mystat-page">
                <div className="mystat-loading">
                    <div className="mystat-badge" style={{ animation: 'pulse 2s infinite' }}>
                        Initialising Performance Hub...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mystat-page">
            <header className="mystat-header">
                <div className="mystat-title">
                    <p className="kds-subtitle">Personal Performance</p>
                    <h1>Welcome back, Staff {user?.id}</h1>
                    <p>Track your operational excellence and upcoming rotation.</p>
                </div>
                <div className="mystat-badge">
                    {getPerformanceStatus(stats?.avg_seconds)} • {user?.role}
                </div>
            </header>

            <div className="mystat-grid">
                <div className="mystat-card">
                    <div className="mystat-card-head">
                        <span className="mystat-card-label">Volume Handled</span>
                        <div className="mystat-card-icon"><ClipboardIcon size={20} /></div>
                    </div>
                    <div>
                        <div className="mystat-card-val">{stats?.order_count || 0}</div>
                        <div className="mystat-trend" style={{ color: 'var(--an-success)' }}>
                            <TrendingUpIcon size={14} /> 8.4% this week
                        </div>
                    </div>
                </div>

                <div className="mystat-card">
                    <div className="mystat-card-head">
                        <span className="mystat-card-label">Fulfillment Pace</span>
                        <div className="mystat-card-icon"><ClockIcon size={20} /></div>
                    </div>
                    <div>
                        <div className="mystat-card-val">{formatFulfillmentTime(stats?.avg_seconds)}</div>
                        <div className="mystat-gauge-container">
                            <div className="mystat-gauge-bar" style={{ width: `${speedScore}%`, background: speedScore > 70 ? 'var(--an-success)' : speedScore > 40 ? 'var(--an-warning)' : 'var(--an-danger)' }}></div>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--an-text-muted)', marginTop: '8px', fontWeight: '700' }}>
                            SPEED SCORE: {speedScore}%
                        </p>
                    </div>
                </div>

                <div className="mystat-card">
                    <div className="mystat-card-head">
                        <span className="mystat-card-label">Next Rotation</span>
                        <div className="mystat-card-icon"><BoltIcon size={20} /></div>
                    </div>
                    <div>
                        {upcomingShifts.length > 0 ? (
                            <>
                                <div className="mystat-card-val" style={{ fontSize: '24px' }}>
                                    {new Date(upcomingShifts[0].start_time).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                </div>
                                <div className="mystat-trend">
                                    {new Date(upcomingShifts[0].start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                    {new Date(upcomingShifts[0].end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </>
                        ) : (
                            <div className="mystat-card-val" style={{ fontSize: '24px', opacity: 0.3 }}>OFF DUTY</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mystat-content">
                <div className="mystat-section">
                    <h2>Operation Timeline</h2>
                    <div className="mystat-timeline">
                        {upcomingShifts.length === 0 ? (
                            <p style={{ color: 'var(--an-text-muted)', textAlign: 'center', padding: '40px' }}>No upcoming shifts scheduled.</p>
                        ) : (
                            upcomingShifts.map((shift, idx) => {
                                const isSoon = idx === 0;
                                return (
                                    <div className="timeline-item" key={shift.id}>
                                        <div className={`timeline-marker ${isSoon ? 'active' : ''}`}>
                                            {isSoon ? <FlameIcon size={18} /> : <GridIcon size={18} />}
                                        </div>
                                        <div className="timeline-info">
                                            <h4>{new Date(shift.start_time).toLocaleDateString([], { month: 'long', day: 'numeric' })}</h4>
                                            <p>
                                                {new Date(shift.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to {new Date(shift.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--an-primary)', marginTop: '4px', display: 'block' }}>
                                                {shift.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="mystat-section" style={{ background: 'linear-gradient(135deg, rgba(244, 140, 37, 0.05), transparent)' }}>
                    <h2>Service Tips</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="toggle-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                            <div className="toggle-info">
                                <h4 style={{ color: 'var(--an-primary)' }}>Peak Efficiency</h4>
                                <p>Your fulfillment speed peaks between 12:00 PM and 2:00 PM. Keep it up!</p>
                            </div>
                        </div>
                        <div className="toggle-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                            <div className="toggle-info">
                                <h4 style={{ color: 'var(--an-success)' }}>Consistency King</h4>
                                <p>You have handled 50+ orders this month with zero error reports.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeePortal;
