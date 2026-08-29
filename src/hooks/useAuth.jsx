import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeCustomer } from '../utils/db';

const AuthContext = createContext(null);
const STORAGE_KEY = 'toy_customer_id';

export function AuthProvider({ children }) {
  const [customerId, setCustomerId] = useState(() => localStorage.getItem(STORAGE_KEY));
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
        setCustomerId(null);
      }
    });
    return unsubscribe;
  }, [customerId]);

  function login(id) {
    localStorage.setItem(STORAGE_KEY, id);
    setCustomerId(id);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setCustomerId(null);
    setCustomer(null);
  }

  return (
    <AuthContext.Provider value={{ customer, customerId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
