import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import {
  AlertIcon,
  CheckIcon,
  PlateIcon,
  StoreIcon,
  UserIcon,
} from '../components/icons';
import '../styles/RegisterBusiness.css';

const RegisterBusiness = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPasswordMismatch = useMemo(() => {
    if (!password || !confirmPassword) return false;
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  const containerRef = useRef(null);

  useEffect(() => {
    // Initial entrance animations
    const tl = anime.timeline({
      easing: 'easeOutExpo',
    });

    tl.add({
      targets: '.register-hero > *',
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(150),
    })
    .add({
      targets: '.register-form-area > *',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
    }, '-=700');

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        tenant_name: tenantName,
        tenant_email: tenantEmail,
        tenant_phone: tenantPhone,
        name: adminName,
        email: adminEmail,
        password,
      });

      login(res.data.user, res.data.token);
      toast.success(`Welcome to DINE-EASE, ${tenantName}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper" ref={containerRef}>
      <div className="register-bg-grid"></div>
      
      <main className="register-main-card">
        {/* Left Section: Hero/Brand */}
        <div className="register-hero">
          <div className="register-brand" onClick={() => navigate('/')}>
            <PlateIcon size={32} color="#f59e0b" />
            <h1>DINE-EASE</h1>
          </div>

          <div className="register-hero-content">
            <p className="input-label" style={{ color: '#f59e0b' }}>Partner with us</p>
            <h2>Empower Your Restaurant Today.</h2>
            
            <div className="register-steps">
              <div className="step-item">
                <div className="step-icon"><StoreIcon size={18} /></div>
                <div className="step-text">
                  <h4>Business Profile</h4>
                  <p>Setup your digital restaurant identity</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-icon"><UserIcon size={18} /></div>
                <div className="step-text">
                  <h4>Admin Account</h4>
                  <p>Create your primary access credentials</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-icon"><CheckIcon size={18} /></div>
                <div className="step-text">
                  <h4>Live in Minutes</h4>
                  <p>Get your dashboard ready instantly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="register-footer" style={{ textAlign: 'left', marginTop: 'auto' }}>
            <p>© 2026 DINE-EASE Premium</p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="register-form-area">
          <div className="register-form-header">
            <h3>Start Your Journey</h3>
            <p>Fill in the details to create your enterprise dashboard.</p>
          </div>

          {error && (
            <div className="login-error-box" style={{ marginBottom: 24 }}>
              <AlertIcon size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-grid">
              {/* Business Info */}
              <div className="form-group-full">
                <label className="input-label">Restaurant Name</label>
                <input
                  className="input-control"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Spice Garden"
                  required
                />
              </div>

              <div>
                <label className="input-label">Business Email</label>
                <input
                  type="email"
                  className="input-control"
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  placeholder="contact@restaurant.com"
                  required
                />
              </div>

              <div>
                <label className="input-label">Phone Number</label>
                <input
                  className="input-control"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  placeholder="+1 555 000 0000"
                  required
                />
              </div>

              <div className="form-group-full" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '10px 0', paddingTop: '20px' }}>
                <label className="input-label" style={{ color: '#f59e0b' }}>Admin Credentials</label>
              </div>

              {/* Admin Info */}
              <div>
                <label className="input-label">Admin Full Name</label>
                <input
                  className="input-control"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Alex Johnson"
                  required
                />
              </div>

              <div>
                <label className="input-label">Admin Email</label>
                <input
                  type="email"
                  className="input-control"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@restaurant.com"
                  required
                />
              </div>

              <div>
                <label className="input-label">Password</label>
                <input
                  type="password"
                  className="input-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="input-label">
                  Confirm Password {isPasswordMismatch && <span style={{ color: '#ef4444' }}>(mismatch)</span>}
                </label>
                <input
                  type="password"
                  className="input-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? 'Creating Your Business...' : 'Securely Register Business →'}
            </button>
          </form>

          <div className="register-footer">
            Already have an account? <span onClick={() => navigate('/login')}>Sign In here</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterBusiness;


