import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BellIcon, GridIcon, KitchenIcon, PlusIcon, SearchIcon } from './icons';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const showQuickActions =
    (user?.role === 'admin' || user?.role === 'manager') &&
    (location.pathname || '').startsWith('/dashboard');

  return (
    <header className="navbar">
      <div className="navbar-center">
        <div className="navbar-search">
          <SearchIcon size={18} style={{ color: 'var(--an-text-muted)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for orders, tables, or staff..."
          />
        </div>

        {showQuickActions && (
          <div className="navbar-actions">
            <button className="navbar-action-btn" onClick={() => navigate('/kitchen')}>
              <KitchenIcon size={16} />
              Kitchen
            </button>
            <button className="navbar-action-btn" onClick={() => navigate('/tables')}>
              <GridIcon size={16} />
              Floor
            </button>
            <button className="navbar-action-btn primary" onClick={() => navigate('/orders')}>
              <PlusIcon size={16} />
              New Order
            </button>
          </div>
        )}
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" aria-label="Notifications">
            <BellIcon size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
