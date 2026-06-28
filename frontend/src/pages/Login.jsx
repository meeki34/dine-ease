import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  AlertIcon,
  BuildingIcon,
  ChartIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  KitchenIcon,
  LockIcon,
  MailIcon,
  PlateIcon,
  ShieldIcon,
} from '../components/icons';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const containerRef = useRef(null);

  useEffect(() => {
    // Initial entrance animations
    const tl = anime.timeline({
      easing: 'easeOutExpo',
    });

    tl.add({
      targets: '.login-left-content > *',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(150),
    })
    .add({
      targets: '.login-form-card',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 1000,
    }, '-=800')
    .add({
      targets: '.login-form-card .login-form > *',
      translateX: [20, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
    }, '-=600');

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.user?.role === 'chef') {
        setError('This is a staff account. Please use Staff Login.');
        return;
      }

      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user?.name || 'User'}!`);

      if (res.data.user?.role === 'superadmin') {
        navigate('/superadmin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const featurePills = [
    { Icon: ChartIcon, label: 'Real-time Analytics' },
    { Icon: KitchenIcon, label: 'Kitchen Queue' },
    { Icon: BuildingIcon, label: 'Multi-tenant' },
  ];

  return (
    <div className="login-wrapper" ref={containerRef}>
      <div className="login-left-panel">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
        <div className="login-orb login-orb-3"></div>

        <div className="login-left-content">
          <div className="login-brand-block">
            <div className="login-logo-row" onClick={() => navigate('/')}>
              <span className="login-logo-icon" aria-hidden="true">
                <PlateIcon />
              </span>
              <h1>DINE-EASE</h1>
            </div>
            <p className="login-brand-tagline">Premium Hospitality Suite</p>
          </div>

          <div className="login-preview-card">
            <div className="login-preview-header">
              <span className="login-preview-title">Live Dashboard</span>
              <div className="login-window-dots">
                <span className="login-dot red"></span>
                <span className="login-dot yellow"></span>
                <span className="login-dot green"></span>
              </div>
            </div>
            <div className="login-preview-grid">
              <div className="login-preview-item">
                <div className="login-bar-chart">
                  <div className="login-bar" style={{ height: '45%' }}></div>
                  <div className="login-bar" style={{ height: '70%' }}></div>
                  <div className="login-bar" style={{ height: '100%' }}></div>
                  <div className="login-bar" style={{ height: '60%' }}></div>
                  <div className="login-bar" style={{ height: '80%' }}></div>
                </div>
              </div>
              <div className="login-preview-item">
                <div className="login-circle-spinner"></div>
              </div>
              <div className="login-preview-item login-preview-wide">
                <div className="login-progress-stack">
                  <div className="login-progress-track">
                    <div className="login-progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <div className="login-progress-track">
                    <div className="login-progress-fill" style={{ width: '50%' }}></div>
                  </div>
                  <div className="login-progress-track">
                    <div className="login-progress-fill" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="login-feature-pills">
            {featurePills.map((f) => (
              <div className="login-pill" key={f.label}>
                <span className="login-pill-icon" aria-hidden="true">
                  <f.Icon />
                </span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-form-card">
          <div className="login-form-header">
            <span className="login-form-badge">Admin Access</span>
            <h2>Admin Sign In</h2>
            <p>Sign in to manage your restaurant business</p>
          </div>

          {error && (
            <div className="login-error-box">
              <span className="login-error-icon" aria-hidden="true">
                <AlertIcon />
              </span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon" aria-hidden="true">
                  <MailIcon />
                </span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@restaurant.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon" aria-hidden="true">
                  <LockIcon />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="login-options-row">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="login-forgot"
                onClick={() => setError('Password reset is not available yet')}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? (
                <span className="login-spinner-wrap">
                  <span className="login-btn-spinner"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div className="login-form-footer">
            <div className="login-divider">
              <span>or</span>
            </div>
            <p className="login-back-link">
              <span onClick={() => navigate('/register')}>New restaurant? Register Business</span>
            </p>
            <p className="login-back-link" style={{ marginTop: 10 }}>
              <span onClick={() => navigate('/staff-login')}>Staff Login →</span>
            </p>
            <p className="login-back-link" style={{ marginTop: 10 }}>
              <span onClick={() => navigate('/')}>← Back to Home</span>
            </p>
          </div>

          <div className="login-trust-bar">
            <div className="login-trust-item">
              <span className="login-trust-icon" aria-hidden="true">
                <LockIcon />
              </span>
              <span>256-bit SSL</span>
            </div>
            <div className="login-trust-item">
              <span className="login-trust-icon" aria-hidden="true">
                <ShieldIcon />
              </span>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="login-trust-item">
              <span className="login-trust-icon" aria-hidden="true">
                <CheckIcon />
              </span>
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

