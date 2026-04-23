import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// UC1 - Auth
import LoginPage from './pages/UC1_Auth/LoginPage';
import RegisterPage from './pages/UC1_Auth/RegisterPage';
import UsersPage from './pages/UC1_Auth/UsersPage';

// UC2 - Product
import ProductsPage from './pages/UC2_Product/ProductsPage';
import AddProductPage from './pages/UC2_Product/AddProductPage';
import ProductDetailPage from './pages/UC2_Product/ProductDetailPage';

import Sidebar from './components/Sidebar';
import './index.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('stockpro_token');
  return token ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <main style={{ flex: 1, padding: '32px', background: 'var(--bg-primary)' }}>
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* UC1 - Auth */}
        <Route path="/uc1/users" element={<PrivateRoute><Layout><UsersPage /></Layout></PrivateRoute>} />
        <Route path="/uc1/register" element={<PrivateRoute><Layout><RegisterPage embedded /></Layout></PrivateRoute>} />

        {/* UC2 - Product */}
        <Route path="/uc2/products" element={<PrivateRoute><Layout><ProductsPage /></Layout></PrivateRoute>} />
        <Route path="/uc2/add-product" element={<PrivateRoute><Layout><AddProductPage /></Layout></PrivateRoute>} />
        <Route path="/uc2/product/:id" element={<PrivateRoute><Layout><ProductDetailPage /></Layout></PrivateRoute>} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/uc1/users" replace />} />
      </Routes>
    </Router>
  );
}

export default App;