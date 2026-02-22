import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRegister from './pages/AdminRegister';
import BuyerProfile from './pages/BuyerProfile';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/buyer/orders" element={
  <ProtectedRoute allowedRoles={['buyer']}>
    <MyOrders />
  </ProtectedRoute>
} />
        <Route path="/buyer/profile" element={
  <ProtectedRoute allowedRoles={['buyer', 'admin', 'superadmin']}>
    <BuyerProfile />
  </ProtectedRoute>
} />
        <Route path="/unauthorized" element={
          <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#080808' }}>
            <span className="text-6xl">🚫</span>
            <h1 className="text-2xl font-bold text-red-400 mt-4">Access Denied</h1>
            <a href="/login" className="mt-4 text-white/40 hover:text-white/70 text-sm transition">
              ← Go to Login
            </a>
          </div>
        } />
        <Route path="/buyer/dashboard" element={
          <ProtectedRoute allowedRoles={['buyer', 'admin', 'superadmin']}>
            <BuyerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
