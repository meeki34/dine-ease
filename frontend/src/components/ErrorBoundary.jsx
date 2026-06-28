import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.bg1} />
          <div style={styles.bg2} />

          <div style={styles.card}>
            <div style={styles.iconWrap}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <h1 style={styles.title}>Something Went Wrong</h1>
            <p style={styles.desc}>
              An unexpected error occurred. Don't worry — your data is safe.
            </p>

            {this.state.error && (
              <div style={styles.errorBox}>
                <code style={styles.errorCode}>
                  {this.state.error.message || 'Unknown error'}
                </code>
              </div>
            )}

            <div style={styles.actions}>
              <button style={styles.btnPrimary} onClick={this.handleReload}>
                Reload Page
              </button>
              <button style={styles.btnSecondary} onClick={this.handleRefresh}>
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0806',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  bg1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(231, 76, 60, 0.3), transparent 70%)',
    filter: 'blur(80px)',
    top: '-100px',
    right: '-100px',
  },
  bg2: {
    position: 'absolute',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201, 164, 73, 0.2), transparent 70%)',
    filter: 'blur(80px)',
    bottom: '-80px',
    left: '-60px',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '48px 40px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(246, 242, 234, 0.08)',
    borderRadius: '24px',
    backdropFilter: 'blur(20px)',
    maxWidth: '480px',
    width: '90%',
  },
  iconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'rgba(231, 76, 60, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#f6f2ea',
    margin: '0 0 12px',
    letterSpacing: '-0.5px',
  },
  desc: {
    fontSize: '15px',
    color: 'rgba(246, 242, 234, 0.5)',
    lineHeight: '1.6',
    margin: '0 0 24px',
  },
  errorBox: {
    background: 'rgba(231, 76, 60, 0.08)',
    border: '1px solid rgba(231, 76, 60, 0.15)',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '28px',
    textAlign: 'left',
  },
  errorCode: {
    fontSize: '13px',
    color: 'rgba(246, 242, 234, 0.6)',
    fontFamily: "'Fira Code', monospace",
    wordBreak: 'break-all',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    background: 'linear-gradient(135deg, #c9a449, #e8b94a)',
    color: '#120d08',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.06)',
    color: '#f6f2ea',
    border: '1px solid rgba(246, 242, 234, 0.12)',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
};

export default ErrorBoundary;
