import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import InventoryAlerts from './components/InventoryAlerts';
import Login from './pages/Login';
import Landing from './pages/Landing';
import RegisterBusiness from './pages/RegisterBusiness';
import StaffLogin from './pages/StaffLogin';
import StaffInvite from './pages/StaffInvite';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Staff from './pages/Staff';
import Tables from './pages/Tables';
import Kitchen from './pages/Kitchen';
import Waiter from './pages/Waiter';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import SuperAdmin from './pages/SuperAdmin';
import StaffScheduling from './pages/StaffScheduling';
import EmployeePortal from './pages/EmployeePortal';
import CustomerMenu from './pages/CustomerMenu';
import Billing from './pages/Billing';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(246, 242, 234, 0.1)',
              borderRadius: '12px',
            },
            success: {
              iconTheme: {
                primary: '#2ed573',
                secondary: '#120d08',
              },
            },
          }}
        />
        <InventoryAlerts />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/staff-invite/:token" element={<StaffInvite />} />
            <Route path="/register" element={<RegisterBusiness />} />
            <Route path="/m/:tenantId/:tableId" element={<CustomerMenu />} />
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Menu /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Orders /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute roles={['admin']}>
                <Layout><Staff /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tables" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Tables /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Inventory /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/suppliers" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Suppliers /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/pos" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><PurchaseOrders /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Expenses /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute roles={['admin', 'manager', 'waiter']}>
                <Layout><Billing /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><Analytics /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute roles={['admin']}>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/kitchen" element={
              <ProtectedRoute roles={['admin', 'manager', 'chef']} loginPath="/staff-login">
                <Layout><Kitchen /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/waiter" element={
              <ProtectedRoute roles={['waiter']} loginPath="/staff-login">
                <Layout><Waiter /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/superadmin" element={
              <ProtectedRoute roles={['superadmin']}>
                <Layout><SuperAdmin /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/staff/scheduling" element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <Layout><StaffScheduling /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/employee-portal" element={
              <ProtectedRoute roles={['admin', 'manager', 'chef', 'waiter']} loginPath="/staff-login">
                <Layout><EmployeePortal /></Layout>
              </ProtectedRoute>
            } />
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
