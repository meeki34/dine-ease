import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { setGlobalCurrency } from '../utils/money';
import { 
  SettingsIcon, 
  UserIcon, 
  BellIcon, 
  BoltIcon, 
  LogoutIcon,
  BuildingIcon,
  SearchIcon,
  ChartIcon,
  ClipboardIcon,
  BoxIcon,
  GridIcon
} from '../components/icons';
import '../styles/Settings.css';

const Settings = () => {
  const { user, login, token } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // General tab state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currency: 'INR',
  });

  // Security tab state
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Notification prefs state
  const [notifPrefs, setNotifPrefs] = useState({
    inventory_alerts: true,
    sales_thresholds: true,
    staff_activity: false,
  });

  // Load profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get('/tenant/profile');
        if (res.data?.data) {
          const t = res.data.data;
          setProfile({
            name: t.name || '',
            email: t.email || '',
            phone: t.phone || '',
            address: t.address || '',
            currency: t.currency || 'INR',
          });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveGeneral = async () => {
    setSaving(true);
    try {
      const res = await API.put('/tenant/settings', profile);
      if (res.data?.status === 'success' || res.status === 200) {
        toast.success('Profile updated successfully!');
        setGlobalCurrency(profile.currency);
        login({ ...user, tenant_currency: profile.currency }, token);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    setPasswordError('');

    if (!passwords.current_password || !passwords.new_password) {
      setPasswordError('All password fields are required');
      return;
    }
    if (passwords.new_password.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const res = await API.put('/tenant/password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      if (res.data?.success) {
        toast.success('Password updated successfully!');
        setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    setSaving(true);
    try {
      // Save notification prefs as part of settings
      await API.put('/tenant/settings', { notification_prefs: notifPrefs });
      toast.success('Notification preferences saved!');
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    switch (activeTab) {
      case 'general':
        return saveGeneral();
      case 'security':
        return savePassword();
      case 'notifications':
        return saveNotifications();
      default:
        toast.success('Settings saved!');
    }
  };

  const handleDiscard = () => {
    if (activeTab === 'security') {
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
      setPasswordError('');
    }
    toast('Changes discarded', { icon: '↩️' });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: BuildingIcon },
    { id: 'security', label: 'Security', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'integrations', label: 'Integrations', icon: BoltIcon },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="settings-section-card">
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'rgba(246,242,234,0.4)' }}>
            Loading settings...
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-section-card">
            <h2>Restaurant Profile</h2>
            <span className="section-desc">Manage your public information and operational details.</span>
            
            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group full-width">
                <label>Restaurant Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter restaurant name" 
                />
              </div>
              <div className="form-group">
                <label>Primary Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Enter contact email" 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={profile.phone} 
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter contact phone" 
                />
              </div>
              <div className="form-group full-width">
                <label>Street Address</label>
                <input 
                  type="text" 
                  value={profile.address} 
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Enter full address" 
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select value={profile.currency} onChange={e => setProfile({ ...profile, currency: e.target.value })}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timezone</label>
                <select>
                  <option value="ist">India Standard Time (IST)</option>
                  <option value="pst">Pacific Time (PT)</option>
                  <option value="est">Eastern Time (ET)</option>
                  <option value="cet">Central European (CET)</option>
                </select>
              </div>
            </form>
          </div>
        );
      case 'security':
        return (
          <div className="settings-section-card">
            <h2>Account Security</h2>
            <span className="section-desc">Update your credentials and manage access control.</span>
            
            {passwordError && (
              <div className="settings-error">{passwordError}</div>
            )}

            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group full-width">
                <label>Current Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  value={passwords.current_password}
                  onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  placeholder="Min. 8 characters"
                  value={passwords.new_password}
                  onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Match new password"
                  value={passwords.confirm_password}
                  onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                />
              </div>

              <div className="full-width" style={{ marginTop: '20px' }}>
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your admin account.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        );
      case 'notifications':
        return (
          <div className="settings-section-card">
            <h2>Operational Alerts</h2>
            <span className="section-desc">Configure how and when you want to be notified.</span>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Inventory Alerts</h4>
                  <p>Notify when items fall below safety stock thresholds.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifPrefs.inventory_alerts}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, inventory_alerts: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Sales Thresholds</h4>
                  <p>Daily performance summary and goal achievements.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifPrefs.sales_thresholds}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, sales_thresholds: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div className="toggle-info">
                  <h4>Staff Activity</h4>
                  <p>Alerts for clock-ins, clock-outs, and shift swaps.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifPrefs.staff_activity}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, staff_activity: e.target.checked })}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );
      case 'integrations':
        return (
          <div className="settings-section-card">
            <h2>Third-Party Connections</h2>
            <span className="section-desc">Sync with your favorite delivery and accounting apps.</span>
            
            <div className="settings-form">
              <div className="toggle-item full-width">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#FF3008', borderRadius: '10px' }} />
                  <div className="toggle-info">
                    <h4>DoorDash Drive</h4>
                    <p>Automated dispatch for delivery orders.</p>
                  </div>
                </div>
                <button className="btn-cancel" style={{ padding: '8px 16px' }}>Connect</button>
              </div>
              <div className="toggle-item full-width">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#2CA01C', borderRadius: '10px' }} />
                  <div className="toggle-info">
                    <h4>QuickBooks Online</h4>
                    <p>Sync daily sales and expense data.</p>
                  </div>
                </div>
                <button className="btn-save" style={{ padding: '8px 16px', color: 'black', boxShadow: 'none' }}>Active</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Global Configurations</h1>
        <p>Tailor the DINE-EASE experience to your restaurant's needs.</p>
      </header>

      <nav className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="settings-content">
        {renderContent()}
        
        <div className="settings-footer">
          <button className="btn-cancel" onClick={handleDiscard}>Discard Changes</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
