import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ZalDetail from './pages/ZalDetail';
import Anbar from './pages/Anbar';
import Kadr from './pages/Kadr';
import DigerXerclar from './pages/DigerXerclar';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/zal/:zalId"
            element={
              <ProtectedRoute>
                <ZalDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anbar"
            element={
              <ProtectedRoute>
                <Anbar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kadr"
            element={
              <ProtectedRoute>
                <Kadr />
              </ProtectedRoute>
            }
          />
          <Route
            path="/xerc"
            element={
              <ProtectedRoute>
                <DigerXerclar />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
