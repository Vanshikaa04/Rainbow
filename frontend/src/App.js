import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top:0, behavior:'smooth' }); }, [pathname]);
  return null;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" toastOptions={{
          duration: 3500,
          style: { background:'white', color:'#1A1A1A', boxShadow:'0 8px 32px rgba(0,0,0,.14)', borderRadius:'13px', padding:'13px 17px', fontSize:'0.88rem', fontFamily:'DM Sans,sans-serif', border:'1px solid #E0E0E0' },
        }}/>
        <Routes>
          <Route path="/"                    element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/product/:id"         element={<PublicLayout><ProductPage /></PublicLayout>} />
          <Route path="/category/:catKey"    element={<PublicLayout><CategoryPage /></PublicLayout>} />
          <Route path="/admin/login"         element={<AdminLogin />} />
          <Route path="/admin/dashboard"     element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*"                    element={<PublicLayout><HomePage /></PublicLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}