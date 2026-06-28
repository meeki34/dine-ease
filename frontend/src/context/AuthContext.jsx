import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import API from '../api/axios';
import { setGlobalCurrency } from '../utils/money';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      if (isMounted) setToken(storedToken);

      try {
        const res = await API.get('/auth/me');
        const me = res.data?.user || null;
        if (!isMounted) return;
        setUser(me);
        if (me) {
          localStorage.setItem('user', JSON.stringify(me));
          if (me.tenant_currency) setGlobalCurrency(me.tenant_currency);
        }
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        if (!isMounted) return;
        setUser(null);
        setToken(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
    if (userData?.tenant_currency) {
      setGlobalCurrency(userData.tenant_currency);
    }
    // Notification will be triggered from the components because they know the context (registration vs login)
    // or we can just trigger a general one here if we want it guaranteed:
    // toast.success(`Welcome back, ${userData?.name || 'User'}!`);
  };

  const logout = () => {
    // Capture role BEFORE clearing state
    const isStaff = ['waiter', 'chef'].includes(user?.role);
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    window.location.href = isStaff ? '/staff-login' : '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
