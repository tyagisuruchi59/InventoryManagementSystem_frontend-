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
//uc3
import WarehousesPage from './pages/UC3_Warehouse/WarehousesPage';
import StockPage from './pages/UC3_Warehouse/StockPage';
import TransferPage from './pages/UC3_Warehouse/TransferPage';

import Sidebar from './components/Sidebar';
import './index.css';
import PurchasePage   from './pages/UC4_Purchase/PurchasePage';
import CreatePOPage   from './pages/UC4_Purchase/CreatePOPage';

import SuppliersPage   from './pages/UC5_Supplier/SuppliersPage';
import AddSupplierPage from './pages/UC5_Supplier/AddSupplierPage';

import MovementsPage      from './pages/UC6_Movement/MovementsPage';
import RecordMovementPage from './pages/UC6_Movement/RecordMovementPage';
import AlertsPage    from './pages/UC7_Alert/AlertsPage';
import SendAlertPage from './pages/UC7_Alert/SendAlertPage';
import ReportsPage from './pages/UC8_Report/ReportsPage';
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
        

      <Route path="/uc3/warehouses" element={<PrivateRoute><Layout><WarehousesPage /></Layout></PrivateRoute>} />
<Route path="/uc3/stock"      element={<PrivateRoute><Layout><StockPage /></Layout></PrivateRoute>} />
<Route path="/uc3/transfer"   element={<PrivateRoute><Layout><TransferPage /></Layout></PrivateRoute>} />

      <Route path="/uc4/purchase"   element={<PrivateRoute><Layout><PurchasePage /></Layout></PrivateRoute>} />
<Route path="/uc4/create-po"  element={<PrivateRoute><Layout><CreatePOPage /></Layout></PrivateRoute>} />
<Route path="/uc5/suppliers"    element={<PrivateRoute><Layout><SuppliersPage /></Layout></PrivateRoute>} />
<Route path="/uc5/add-supplier" element={<PrivateRoute><Layout><AddSupplierPage /></Layout></PrivateRoute>} />

<Route path="/uc6/movements"       element={<PrivateRoute><Layout><MovementsPage /></Layout></PrivateRoute>} />
<Route path="/uc6/record-movement" element={<PrivateRoute><Layout><RecordMovementPage /></Layout></PrivateRoute>} />
<Route path="/uc7/alerts"      element={<PrivateRoute><Layout><AlertsPage /></Layout></PrivateRoute>} />
<Route path="/uc7/send-alert"  element={<PrivateRoute><Layout><SendAlertPage /></Layout></PrivateRoute>} />
<Route path="/uc8/reports" element={<PrivateRoute><Layout><ReportsPage /></Layout></PrivateRoute>} />


        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/uc1/users" replace />} />
      </Routes>
    </Router>
  );
}

export default App;