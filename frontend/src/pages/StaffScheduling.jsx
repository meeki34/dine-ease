import React, { useMemo, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon } from '../components/icons';
import API from '../api/axios';
import '../styles/SuperAdmin.css'; // Reusing some glassmorphic styles

const SHIFT_STATUSES = ['scheduled', 'in_progress', 'completed', 'absent'];

const toDateTimeLocalValue = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
};

const StaffScheduling = () => {
    const [shifts, setShifts] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingShift, setEditingShift] = useState(null);

    const [filters, setFilters] = useState({
        from: '',
        to: '',
        user_id: '',
        status: ''
    });

    const [newShift, setNewShift] = useState({
        user_id: '',
        start_time: '',
        end_time: '',
        status: 'scheduled'
    });

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shiftQueryString = useMemo(() => {
        const params = new URLSearchParams();
        if (filters.from) params.set('from', filters.from);
        if (filters.to) params.set('to', filters.to);
        if (filters.user_id) params.set('user_id', filters.user_id);
        if (filters.status) params.set('status', filters.status);
        const s = params.toString();
        return s ? `?${s}` : '';
    }, [filters]);

    const fetchData = async () => {
        try {
            const [shiftsRes, staffRes] = await Promise.all([
                API.get(`/performance/shifts${shiftQueryString}`),
                API.get('/staff')
            ]);
            setShifts(shiftsRes.data?.data || []);
            setStaff(staffRes.data?.data || []);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load scheduling data');
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingShift(null);
        setNewShift({ user_id: '', start_time: '', end_time: '', status: 'scheduled' });
        setShowModal(true);
    };

    const openEdit = (shift) => {
        setEditingShift(shift);
        setNewShift({
            user_id: String(shift.user_id || ''),
            start_time: toDateTimeLocalValue(shift.start_time),
            end_time: toDateTimeLocalValue(shift.end_time),
            status: shift.status || 'scheduled'
        });
        setShowModal(true);
    };

    const validateShift = () => {
        if (!newShift.user_id) return 'Staff member is required';
        if (!newShift.start_time || !newShift.end_time) return 'Start and end times are required';
        const start = new Date(newShift.start_time);
        const end = new Date(newShift.end_time);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Invalid start/end time';
        if (start.getTime() >= end.getTime()) return 'Start time must be before end time';
        if (newShift.status && !SHIFT_STATUSES.includes(newShift.status)) return 'Invalid status';
        return '';
    };

    const handleSaveShift = async (e) => {
        e.preventDefault();
        const err = validateShift();
        if (err) return toast.error(err);
        try {
            const payload = {
                user_id: Number(newShift.user_id),
                start_time: newShift.start_time,
                end_time: newShift.end_time,
                status: newShift.status
            };

            if (editingShift) {
                await API.put(`/performance/shifts/${editingShift.id}`, payload);
                toast.success('Shift updated successfully');
            } else {
                await API.post('/performance/shifts', payload);
                toast.success('Shift scheduled successfully');
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save shift');
        }
    };

    const handleDeleteShift = async (shift) => {
        const ok = window.confirm('Delete this shift?');
        if (!ok) return;
        try {
            await API.delete(`/performance/shifts/${shift.id}`);
            toast.success('Shift deleted');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete shift');
        }
    };

    const handleStatusChange = async (shift, status) => {
        try {
            await API.put(`/performance/shifts/${shift.id}`, { status });
            setShifts((prev) => prev.map((s) => (s.id === shift.id ? { ...s, status } : s)));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) return <div className="loading">Loading Schedule...</div>;

    return (
        <div className="super-admin-container">
            <header className="page-header">
                <div>
                    <h1>Staff Scheduling</h1>
                    <p>Manage employee shifts and labor distribution</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    <PlusIcon /> New Shift
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Active Shifts</h3>
                    <p className="stat-value">{shifts.filter(s => s.status === 'in_progress').length}</p>
                </div>
                <div className="stat-card">
                    <h3>Scheduled Today</h3>
                    <p className="stat-value">
                        {shifts.filter(s => new Date(s.start_time).toDateString() === new Date().toDateString()).length}
                    </p>
                </div>
            </div>

            <div className="table-container" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>From</label>
                        <input
                            type="date"
                            value={filters.from}
                            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>To</label>
                        <input
                            type="date"
                            value={filters.to}
                            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, minWidth: '180px' }}>
                        <label>Staff</label>
                        <select
                            value={filters.user_id}
                            onChange={(e) => setFilters((f) => ({ ...f, user_id: e.target.value }))}
                        >
                            <option value="">All</option>
                            {staff.map((s) => (
                                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, minWidth: '160px' }}>
                        <label>Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                        >
                            <option value="">All</option>
                            {SHIFT_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-secondary" onClick={fetchData} style={{ height: '40px' }}>
                        Apply Filters
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => { setFilters({ from: '', to: '', user_id: '', status: '' }); }}
                        style={{ height: '40px' }}
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Staff Member</th>
                            <th>Role</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts.map(shift => (
                            <tr key={shift.id}>
                                <td>{shift.User?.name}</td>
                                <td><span className={`role-badge ${shift.User?.role}`}>{shift.User?.role}</span></td>
                                <td>{new Date(shift.start_time).toLocaleString()}</td>
                                <td>{new Date(shift.end_time).toLocaleString()}</td>
                                <td>
                                    <select
                                        value={shift.status}
                                        onChange={(e) => handleStatusChange(shift, e.target.value)}
                                    >
                                        {SHIFT_STATUSES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="actions-cell">
                                    <button className="btn-secondary" onClick={() => openEdit(shift)}>
                                        Edit
                                    </button>
                                    <button className="btn-secondary" onClick={() => handleDeleteShift(shift)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <h2>{editingShift ? 'Edit Shift' : 'Schedule New Shift'}</h2>
                        <form onSubmit={handleSaveShift}>
                            <div className="form-group">
                                <label>Staff Member</label>
                                <select 
                                    value={newShift.user_id} 
                                    onChange={(e) => setNewShift({...newShift, user_id: e.target.value})}
                                    required
                                >
                                    <option value="">Select Staff</option>
                                    {staff.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input 
                                    type="datetime-local" 
                                    value={newShift.start_time}
                                    onChange={(e) => setNewShift({...newShift, start_time: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input 
                                    type="datetime-local" 
                                    value={newShift.end_time}
                                    onChange={(e) => setNewShift({...newShift, end_time: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={newShift.status}
                                    onChange={(e) => setNewShift({ ...newShift, status: e.target.value })}
                                    required
                                >
                                    {SHIFT_STATUSES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">{editingShift ? 'Save' : 'Schedule'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffScheduling;
