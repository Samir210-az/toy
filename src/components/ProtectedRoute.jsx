import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { customer, customerId, loading } = useAuth();

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

  return children;
}
