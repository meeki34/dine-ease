import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  BoltIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PlateIcon,
  ShieldIcon,
} from '../components/icons';
import '../styles/StaffLogin.css';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      const role = res.data?.user?.role;

      if (role !== 'chef' && role !== 'waiter') {
        setError('Use Admin Login for management access.');
        return;
      }

      login(res.data.user, res.data.token);
      navigate(role === 'waiter' ? '/waiter' : '/kitchen');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-login-container">
      <div className="staff-login-card">
        <span className="staff-badge">Staff Access</span>
        <h1>Staff Sign In</h1>
        <p className="subtitle">Sign in to access your workspace</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon" aria-hidden="true">
                <MailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon" aria-hidden="true">
                <LockIcon />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="staff-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="divider">OR</div>

        <div className="staff-links">
          <span onClick={() => navigate('/login')}>Admin Login →</span>
          <span onClick={() => navigate('/')}>← Back to Home</span>
        </div>

        <div className="staff-footer-badges">
          <div className="footer-badge">
            <PlateIcon aria-hidden="true" />
            <span>Fast Workflow</span>
          </div>
          <div className="footer-badge">
            <ShieldIcon aria-hidden="true" />
            <span>Secure Access</span>
          </div>
          <div className="footer-badge">
            <BoltIcon aria-hidden="true" />
            <span>Live Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
