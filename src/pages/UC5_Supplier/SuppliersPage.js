// StockPro Inventory Management System
// UC5 - Supplier Service | Page: Suppliers
// Developer: Suru | April 2026

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierAPI } from '../../api';

function SuppliersPage() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const role = localStorage.getItem('stockpro_role');

  useEffect(() => { loadSuppliers(); }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const res = await supplierAPI.get('/api/suppliers');
      setSuppliers(res.data);
    } catch (err) { setError('Could not load suppliers'); }
    setLoading(false);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this supplier?')) return;
    try {
      await supplierAPI.put(`/api/suppliers/${id}/deactivate`);
      loadSuppliers();
    } catch { alert('Error deactivating supplier'); }
  };

  const filtered = suppliers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.city?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Suppliers', value: suppliers.length, icon: '🏢' },
    { label: 'Active', value: suppliers.filter(s => s.isActive).length, icon: '✅' },
    { label: 'Inactive', value: suppliers.filter(s => !s.isActive).length, icon: '❌' },
    { label: 'Cities', value: [...new Set(suppliers.map(s => s.city).filter(Boolean))].length, icon: '📍' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC5 · SUPPLIER SERVICE</div>
          <h1 style={styles.title}>Supplier Management</h1>
          <p style={styles.subtitle}>Manage vendor relationships and supplier catalogue</p>
        </div>
        {role === 'ADMIN' && (
          <button onClick={() => navigate('/uc5/add-supplier')} style={styles.btnPrimary}>+ Add Supplier</button>
        )}
      </div>

      {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

      {/* Stats */}
      <div style={styles.statsRow}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={{ fontSize: '24px' }}>{s.icon}</span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e94560' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="🔍 Search by name, email or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...styles.input, maxWidth: '400px' }}
        />
      </div>

      {loading ? (
        <div style={styles.loading}>Loading suppliers...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>GST Number</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ backgroundColor: i % 2 === 0 ? '#0f0f23' : '#0d0d1a' }}>
                  <td style={styles.td}><span style={{ fontFamily: 'monospace', color: '#e94560' }}>#{s.id}</span></td>
                  <td style={{ ...styles.td, color: 'white', fontWeight: 600 }}>{s.name}</td>
                  <td style={styles.td}>{s.email}</td>
                  <td style={styles.td}>{s.phone}</td>
                  <td style={styles.td}>{s.city}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>{s.gstNumber || '—'}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                      backgroundColor: s.isActive ? 'rgba(74,222,128,0.1)' : 'rgba(100,100,100,0.1)',
                      color: s.isActive ? '#4ade80' : '#666',
                      border: `1px solid ${s.isActive ? 'rgba(74,222,128,0.3)' : '#333'}`
                    }}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={styles.td}>
                    {role === 'ADMIN' && s.isActive && (
                      <button onClick={() => handleDeactivate(s.id)} style={styles.btnDanger}>Deactivate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px' }}>🏢</div>
              No suppliers found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  ucBadge: { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title: { color: 'white', fontSize: '32px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  btnPrimary: { padding: '10px 20px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  btnDanger: { padding: '4px 10px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  tableWrapper: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#ffffff08' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '1.5px', color: '#666', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#999', borderBottom: '1px solid #ffffff08' },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default SuppliersPage;