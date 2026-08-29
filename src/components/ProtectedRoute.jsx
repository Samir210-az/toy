import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { customer, customerId, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
        <p className="text-gray-500 text-sm">Yüklənir...</p>
      </div>
    );
  }

  if (!customerId || !customer) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'anbarci' && location.pathname !== '/anbar') {
    return <Navigate to="/anbar" replace />;
  }

  return children;
}
