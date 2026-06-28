import { useEffect, useState, useMemo } from 'react';
import API from '../api/axios';
import { downloadCSV } from '../utils/exportUtils';
import { 
  UsersIcon, 
  ChefIcon, 
  ChartIcon, 
  PlusIcon, 
  TrendingUpIcon, 
  BuildingIcon,
  PlateIcon,
  LogoutIcon,
  SearchIcon,
  BellIcon,
  GridIcon,
  DownloadIcon
} from '../components/icons';
import '../styles/Staff.css';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState('');
  const [formData, setFormData] = useState({ email: '', role: 'chef' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [invitesError, setInvitesError] = useState('');
  const [invitesLoading, setInvitesLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await API.get('/staff');
      setStaff(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvites = async () => {
    setInvitesLoading(true);
    setInvitesError('');
    try {
      const res = await API.get('/staff/invites');
      setInvites(res.data?.data || []);
    } catch (err) {
      setInvites([]);
      setInvitesError(err.response?.data?.message || err.message || 'Failed to load invites');
    } finally {
      setInvitesLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchInvites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setInviteUrl('');
    try {
      const res = await API.post('/staff/invites', formData);
      const url = res.data?.data?.inviteUrl || '';
      setInviteUrl(url);
      fetchInvites();
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to create invite');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      window.prompt('Copy invite link:', text);
    }
  };

  const handleRegenerate = async (id) => {
    setInvitesError('');
    try {
      const res = await API.post(`/staff/invites/${id}/regenerate`);
      const url = res.data?.data?.inviteUrl || '';
      if (url) {
        setInviteUrl(url);
        setShowModal(true); // Show the new link in the modal
      }
      fetchInvites();
    } catch (err) {
      setInvitesError(err.response?.data?.message || err.message || 'Failed to regenerate invite');
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this staff member? They will lose access immediately.')) {
      try {
        await API.delete(`/staff/${id}`);
        fetchStaff();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stats = useMemo(() => {
    const active = staff.filter(s => s.is_active).length;
    const chefs = staff.filter(s => s.role === 'chef').length;
    const managers = staff.filter(s => s.role === 'manager').length;
    return { total: staff.length, active, chefs, managers };
  }, [staff]);

  const filteredStaff = useMemo(() => {
    if (!query) return staff;
    const lowQuery = query.toLowerCase();
    return staff.filter(s => 
      s.name?.toLowerCase().includes(lowQuery) || 
      s.email?.toLowerCase().includes(lowQuery) ||
      s.role?.toLowerCase().includes(lowQuery)
    );
  }, [staff, query]);

  const activeInvites = invites.filter(inv => !inv.used_at).slice(0, 4);

  return (
    <div className="staff-page">
      <header className="staff-header">
        <div>
          <h1>Team Operations</h1>
          <p>Orchestrate your world-class hospitality team</p>
        </div>
        <div className="staff-actions">
          <button className="invite-btn" style={{ background: 'transparent', border: '1px solid var(--an-border)', color: 'white' }} onClick={() => downloadCSV(staff, 'Staff_Roster')}>
            <DownloadIcon size={18} />
            Export CSV
          </button>
          <button className="btn-invite" onClick={() => {
            setInviteUrl('');
            setFormError('');
            setFormData({ email: '', role: 'chef' });
            setShowModal(true);
          }}>
            <PlusIcon size={18} />
            Invite Staff
          </button>
        </div>
      </header>

      <section className="staff-stats-grid">
        <div className="staff-stat-card">
          <div className="staff-stat-info">
            <span className="staff-stat-label">Total Roster</span>
            <p className="staff-stat-value">{stats.total}</p>
          </div>
          <div className="staff-stat-icon">
            <UsersIcon size={24} />
          </div>
        </div>
        <div className="staff-stat-card">
          <div className="staff-stat-info">
            <span className="staff-stat-label">Active Now</span>
            <p className="staff-stat-value">{stats.active}</p>
          </div>
          <div className="staff-stat-icon" style={{ color: '#2ed573' }}>
            <TrendingUpIcon size={24} />
          </div>
        </div>
        <div className="staff-stat-card">
          <div className="staff-stat-info">
            <span className="staff-stat-label">Culinary Team</span>
            <p className="staff-stat-value">{stats.chefs}</p>
          </div>
          <div className="staff-stat-icon">
            <ChefIcon size={24} />
          </div>
        </div>
        <div className="staff-stat-card">
          <div className="staff-stat-info">
            <span className="staff-stat-label">Leadership</span>
            <p className="staff-stat-value">{stats.managers}</p>
          </div>
          <div className="staff-stat-icon">
            <BuildingIcon size={24} />
          </div>
        </div>
      </section>

      {activeInvites.length > 0 && (
        <section className="invites-section">
          <div className="invites-header">
            <h2>Pending Boarding</h2>
            <button className="invite-btn" style={{ width: 'auto' }} onClick={fetchInvites}>Refresh</button>
          </div>
          <div className="invites-list">
            {activeInvites.map(inv => (
              <div className="invite-card" key={inv.id}>
                <div className="invite-card-top">
                  <span className="invite-email">{inv.email}</span>
                  <span className="invite-badge active">Pending</span>
                </div>
                <div className="invite-details">
                  <span>Role: {inv.role}</span>
                  <span>Expires: {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : '—'}</span>
                </div>
                <div className="invite-actions">
                  <button className="invite-btn" onClick={() => handleCopy(inv.inviteUrl)} disabled={!inv.inviteUrl}>
                    Copy Link
                  </button>
                  <button className="invite-btn" onClick={() => handleRegenerate(inv.id)}>
                    Regenerate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="staff-table-container">
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--an-border)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Active Personnel</h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <SearchIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Filter by name or role..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: '10px 12px 10px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--an-border)', borderRadius: '12px', color: 'white', fontSize: '14px' }}
            />
          </div>
        </div>
        <table className="staff-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Analyzing team data...</td></tr>
            ) : filteredStaff.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No matching personnel found.</td></tr>
            ) : (
              filteredStaff.map(member => (
                <tr key={member._id || member.id}>
                  <td>
                    <div className="staff-profile-cell">
                      <div className="staff-profile-avatar">
                        {member.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700 }}>{member.name || 'Anonymous'}</span>
                        <span style={{ fontSize: '12px', color: 'var(--an-text-muted)' }}>Staff Partner</span>
                      </div>
                    </div>
                  </td>
                  <td>{member.email}</td>
                  <td>
                    <span className={`staff-role-pill role-${member.role}`}>
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <div className="status-indicator">
                      <span className={`status-dot ${member.is_active ? 'active' : 'inactive'}`} />
                      {member.is_active ? 'In Service' : 'Off Duty'}
                    </div>
                  </td>
                  <td>
                    {member.is_active && (
                      <button className="btn-action" onClick={() => handleDeactivate(member._id || member.id)}>
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {showModal && (
        <div className="an-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="an-modal" onClick={e => e.stopPropagation()}>
            <h2>Invite Personnel</h2>
            <p>Onboard a new member to the DINE-EASE network.</p>

            {formError && <div className="error-msg" style={{ marginBottom: '20px' }}>{formError}</div>}
            
            {inviteUrl && (
              <div className="invite-result">
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--an-text-muted)', textTransform: 'uppercase' }}>Onboarding Link Generated</span>
                <div className="result-url">{inviteUrl}</div>
                <button 
                  className="invite-btn" 
                  style={{ marginTop: '12px', background: '#2ed573', color: '#000', border: 'none' }}
                  onClick={() => handleCopy(inviteUrl)}
                >
                  Copy Secure Link
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Professional Email</label>
                <input 
                  type="email" 
                  placeholder="name@restaurant.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-field">
                <label>Operational Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="chef">Executive Chef</option>
                  <option value="manager">Operations Manager</option>
                  <option value="waiter">Service Staff</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-an" disabled={formLoading}>
                  {formLoading ? 'Processing...' : 'Issue Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
