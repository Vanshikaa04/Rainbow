import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyAdmin } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rainbow_admin_token');
    if (token) {
      verifyAdmin()
        .then(r => setAdmin(r.data.admin))
        .catch(() => localStorage.removeItem('rainbow_admin_token'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login  = (token, data) => { localStorage.setItem('rainbow_admin_token', token); setAdmin(data); };
  const logout = ()            => { localStorage.removeItem('rainbow_admin_token'); setAdmin(null); };

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  return admin ? children : <Navigate to="/admin/login" replace />;
};