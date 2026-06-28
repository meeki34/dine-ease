import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import { 
  BuildingIcon, 
  UsersIcon, 
  BoxIcon, 
  TrashIcon, 
  CheckIcon,
  ChartIcon
} from '../components/icons';
import '../styles/SuperAdmin.css';

const SuperAdmin = () => {
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tenantsRes, statsRes] = await Promise.all([
        API.get('/superadmin/tenants'),
        API.get('/superadmin/stats')
      ]);
      setTenants(tenantsRes.data.data);
      setStats(statsRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching superadmin data:', err);
      setError('Failed to load system data');
      setLoading(false);
      toast.error('Failed to load system data');
    }
  };

  const handleToggleStatus = async (tenantId, currentStatus) => {
    try {
      await API.put(`/superadmin/tenants/${tenantId}`, {
        is_active: !currentStatus
      });
      toast.success(`Tenant ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update tenant status');
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This action is permanent and will delete all associated data.')) {
      return;
    }

    try {
      await API.delete(`/superadmin/tenants/${tenantId}`);
      toast.success('Tenant deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete tenant');
    }
  };

  if (loading) {
    return (
      <div className="superadmin-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing Enterprise Intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="superadmin-page">
        <div className="dashboard-error">
          <p>{error}</p>
          <button className="dash-link" onClick={fetchData}>Retry Analysis</button>
        </div>
      </div>
    );
  }

  return (
    <div className="superadmin-page">
      <header className="superadmin-header">
        <div>
          <h1>Global System Intelligence</h1>
          <p>Comprehensive oversight of all platform nodes and entities</p>
        </div>
        <div className="dashboard-admin-badge">Super Admin Access</div>
      </header>

      <section className="superadmin-stats">
        <div className="stat-card">
          <div className="stat-icon"><BuildingIcon /></div>
          <div className="stat-label">Total Entities</div>
          <div className="stat-value">{stats?.tenants?.total || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#2ed573', background: 'rgba(46, 213, 115, 0.1)' }}>
            <CheckIcon />
          </div>
          <div className="stat-label">Active Nodes</div>
          <div className="stat-value">{stats?.tenants?.active || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)' }}>
            <BoxIcon />
          </div>
          <div className="stat-label">Inactive Nodes</div>
          <div className="stat-value">{stats?.tenants?.inactive || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><UsersIcon /></div>
          <div className="stat-label">Total Operators</div>
          <div className="stat-value">{stats?.users?.total || 0}</div>
        </div>
      </section>

      <main className="tenants-panel">
        <div className="panel-header">
          <h2>
            <ChartIcon />
            Entity Management Cloud
          </h2>
        </div>

        <div className="tenants-table-container">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>Entity Details</th>
                <th>Network Status</th>
                <th>Registration Date</th>
                <th style={{ textAlign: 'right' }}>Management</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="tenant-row">
                  <td>
                    <div className="tenant-info">
                      <span className="tenant-name">{tenant.name}</span>
                      <span className="tenant-email">{tenant.email}</span>
                      {tenant.phone && <span className="tenant-email">{tenant.phone}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${tenant.is_active ? 'active' : 'inactive'}`}>
                      {tenant.is_active ? 'Operational' : 'Offline'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      {new Date(tenant.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="action-btn toggle" 
                        title={tenant.is_active ? 'Deactivate' : 'Activate'}
                        onClick={() => handleToggleStatus(tenant.id, tenant.is_active)}
                      >
                        {tenant.is_active ? <BoxIcon /> : <CheckIcon />}
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Purge Entity"
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                    No entities identified in the global mesh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default SuperAdmin;