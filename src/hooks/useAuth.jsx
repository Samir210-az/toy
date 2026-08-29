import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeCustomer } from '../utils/db';

const AuthContext = createContext(null);
const STORAGE_KEY = 'toy_customer_id';
const ROLE_KEY = 'toy_role';

export function AuthProvider({ children }) {
  const [customerId, setCustomerId] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY) || 'owner');
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) {
      setCustomer(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeCustomer(customerId, (data) => {
      setCustomer(data);
      setLoading(false);
      if (!data) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ROLE_KEY);
        setCustomerId(null);
      }
    });
    return unsubscribe;
  }, [customerId]);

  function login(id, userRole = 'owner') {
    localStorage.setItem(STORAGE_KEY, id);
    localStorage.setItem(ROLE_KEY, userRole);
    setRole(userRole);
    setCustomerId(id);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ROLE_KEY);
    setCustomerId(null);
    setCustomer(null);
    setRole('owner');
  }

  return (
    <AuthContext.Provider value={{ customer, customerId, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
