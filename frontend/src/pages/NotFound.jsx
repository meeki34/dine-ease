import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-bg">
        {/* Floating orbs */}
        <div className="nf-orb nf-orb-1" />
        <div className="nf-orb nf-orb-2" />
        <div className="nf-orb nf-orb-3" />
      </div>

      <div className="notfound-content">
        <div className="notfound-glitch" data-text="404">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-desc">
          The page you're looking for doesn't exist or has been moved.
          <br />Let's get you back on track.
        </p>

        <div className="notfound-actions">
          <button className="nf-btn nf-btn-primary" onClick={() => navigate('/dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Go to Dashboard
          </button>
          <button className="nf-btn nf-btn-secondary" onClick={() => navigate('/')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
