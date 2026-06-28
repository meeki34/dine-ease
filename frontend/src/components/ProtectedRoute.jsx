import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles, loginPath = '/login' }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to={loginPath} />;

  if (roles && !roles.includes(user.role)) {
    const fallback =
      user.role === 'superadmin'
        ? '/superadmin'
        : user.role === 'waiter'
          ? '/waiter'
        : user.role === 'chef'
          ? '/kitchen'
          : '/dashboard';
    return <Navigate to={fallback} />;
  }

  return children;
};

export default ProtectedRoute;
