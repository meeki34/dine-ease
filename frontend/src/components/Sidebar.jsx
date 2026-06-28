import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  BuildingIcon,
  ChartIcon,
  ClipboardIcon,
  BoxIcon,
  GridIcon,
  KitchenIcon,
  ListIcon,
  LogoutIcon,
  PlateIcon,
  DollarIcon,
  UsersIcon,
  SettingsIcon,
  ReceiptIcon,
} from './icons';
import '../styles/Sidebar.css';

const SunIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const adminLinks = [
    { path: '/dashboard', icon: ChartIcon, label: 'Dashboard' },
    { path: '/orders', icon: ClipboardIcon, label: 'Orders' },
    { path: '/menu', icon: ListIcon, label: 'Menu' },
    { path: '/staff', icon: UsersIcon, label: 'Staff' },
    { path: '/analytics', icon: ChartIcon, label: 'Reports' },
    { path: '/tables', icon: GridIcon, label: 'Tables' },
    { path: '/billing', icon: ReceiptIcon, label: 'Billing' },
    { path: '/inventory', icon: BoxIcon, label: 'Inventory' },
    { path: '/suppliers', icon: BuildingIcon, label: 'Suppliers' },
    { path: '/expenses', icon: DollarIcon, label: 'Expenses' },
    { path: '/kitchen', icon: KitchenIcon, label: 'Kitchen' },
  ];

  const managerLinks = [
    { path: '/dashboard', icon: ChartIcon, label: 'Dashboard' },
    { path: '/orders', icon: ClipboardIcon, label: 'Orders' },
    { path: '/menu', icon: ListIcon, label: 'Menu' },
    { path: '/analytics', icon: ChartIcon, label: 'Reports' },
    { path: '/tables', icon: GridIcon, label: 'Tables' },
    { path: '/billing', icon: ReceiptIcon, label: 'Billing' },
    { path: '/inventory', icon: BoxIcon, label: 'Inventory' },
    { path: '/suppliers', icon: BuildingIcon, label: 'Suppliers' },
    { path: '/expenses', icon: DollarIcon, label: 'Expenses' },
    { path: '/kitchen', icon: KitchenIcon, label: 'Kitchen' },
  ];

  const getLinks = () => {
    if (user?.role === 'superadmin') return [{ path: '/superadmin', icon: BuildingIcon, label: 'Tenants' }];
    if (user?.role === 'chef') return [
      { path: '/kitchen', icon: KitchenIcon, label: 'Kitchen' },
      { path: '/orders', icon: ClipboardIcon, label: 'Orders' },
      { path: '/employee-portal', icon: ChartIcon, label: 'My Stats' },
    ];
    if (user?.role === 'waiter') return [
      { path: '/waiter', icon: ClipboardIcon, label: 'Take Orders' },
      { path: '/billing', icon: ReceiptIcon, label: 'Billing' },
      { path: '/employee-portal', icon: ChartIcon, label: 'My Stats' },
    ];
    if (user?.role === 'manager') return managerLinks;
    return adminLinks;
  };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <span className="sidebar-logo-icon">
          <PlateIcon />
        </span>
        <h2>DINE-EASE</h2>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{avatarLetter}</div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user?.name || 'Guest Operator'}</p>
          <p className="sidebar-user-role">{user?.role || 'Staff'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {getLinks().map((link) => (
          <div
            key={link.path}
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(link.path);
            }}
          >
            <span className="sidebar-link-icon">
              <link.icon />
            </span>
            <span className="sidebar-link-label">{link.label}</span>
          </div>
        ))}
        {user?.role === 'admin' && (
          <div 
            className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => navigate('/settings')} 
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate('/settings');
            }}
          >
            <span className="sidebar-link-icon"><SettingsIcon /></span>
            <span className="sidebar-link-label">Settings</span>
          </div>
        )}
      </nav>

      <footer className="sidebar-footer">
        <div className="sidebar-theme-toggle" onClick={toggleTheme} role="button" tabIndex={0} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <span className="sidebar-link-icon">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
        <button type="button" className="sidebar-logout" onClick={logout} aria-label="Logout">
          <span className="sidebar-link-icon">
            <LogoutIcon />
          </span>
          <span>Logout</span>
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;
