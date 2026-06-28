import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import '../styles/StaffInvite.css';

const StaffInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get(`/staff/invites/${token}`);
        if (!mounted) return;
        setInvite(res.data?.data || null);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Invite is invalid or expired');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (token) load();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleAccept = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/staff/invites/accept', { token, name, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invite');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="invite-wrapper">
      <div className="invite-card">
        <div className="invite-header">
          <div className="invite-brand" onClick={() => navigate('/')}>
            <span className="invite-logo">🍽️</span>
            <h1>DINE-EASE</h1>
          </div>
          <p className="invite-subtitle">Staff invitation</p>
        </div>

        {loading ? (
          <div className="invite-loading">Loading invite…</div>
        ) : error ? (
          <div className="invite-error">
            <p>{error}</p>
            <button className="invite-btn secondary" onClick={() => navigate('/staff-login')}>
              Go to Staff Login
            </button>
          </div>
        ) : success ? (
          <div className="invite-success">
            <h2>Invite accepted</h2>
            <p>Your account is ready. You can sign in now.</p>
            <button className="invite-btn" onClick={() => navigate('/staff-login')}>
              Continue to Staff Login →
            </button>
          </div>
        ) : (
          <>
            <div className="invite-meta">
              <p>
                <span>Restaurant:</span> {invite?.tenant?.name || '—'}
              </p>
              <p>
                <span>Email:</span> {invite?.email || '—'}
              </p>
              <p>
                <span>Role:</span> {invite?.role || '—'}
              </p>
            </div>

            <form onSubmit={handleAccept} className="invite-form">
              <div className="invite-field">
                <label htmlFor="invite-name">Full Name</label>
                <input
                  id="invite-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="invite-field">
                <label htmlFor="invite-password">Password</label>
                <input
                  id="invite-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="invite-field">
                <label htmlFor="invite-confirm">Confirm Password</label>
                <input
                  id="invite-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
                />
              </div>

              {error && <div className="invite-inline-error">{error}</div>}

              <button className="invite-btn" type="submit" disabled={submitting}>
                {submitting ? 'Accepting…' : 'Accept Invite →'}
              </button>

              <button
                type="button"
                className="invite-btn secondary"
                onClick={() => navigate('/staff-login')}
              >
                Already have an account? Sign in
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffInvite;

