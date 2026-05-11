// StockPro Inventory Management System
// UC3 - Warehouse Service | Page: Warehouses
// Developer: Suru | April 2026
// Description: GET /api/warehouse → shows all warehouses

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { warehouseAPI } from '../../api';

function WarehousesPage() {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', capacity: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const role = localStorage.getItem('stockpro_role');

  useEffect(() => { loadWarehouses(); }, []);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const res = await warehouseAPI.get('/api/warehouse');
      setWarehouses(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await warehouseAPI.post('/api/warehouse', {
        ...form, capacity: parseInt(form.capacity)
      });
      setSuccess('Warehouse created!');
      setShowForm(false);
      setForm({ name: '', address: '', city: '', capacity: '' });
      loadWarehouses();
    } catch { setError('Error creating warehouse'); }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this warehouse?')) return;
    try {
      await warehouseAPI.put(`/api/warehouse/${id}/deactivate`);
      loadWarehouses();
    } catch { alert('Error deactivating'); }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC3 · WAREHOUSE SERVICE</div>
          <h1 style={styles.title}>Warehouse Management</h1>
          <p style={styles.subtitle}>Manage physical warehouse locations and stock</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/uc3/stock')} style={styles.btnSecondary}>📦 Stock Levels</button>
          <button onClick={() => navigate('/uc3/transfer')} style={styles.btnSecondary}>⇄ Transfer Stock</button>
          {role === 'ADMIN' && (
            <button onClick={() => setShowForm(!showForm)} style={styles.btnPrimary}>
              {showForm ? '✕ Cancel' : '+ Add Warehouse'}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error   && <div style={styles.errorMsg}>⚠️ {error}</div>}
      {success && <div style={styles.successMsg}>✅ {success}</div>}

      {/* Add form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontFamily: 'monospace' }}>New Warehouse</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' }}>
              {[
                { name: 'name', placeholder: 'Warehouse name e.g. Delhi Warehouse' },
                { name: 'city', placeholder: 'City e.g. New Delhi' },
                { name: 'address', placeholder: 'Full address' },
                { name: 'capacity', placeholder: 'Capacity in units e.g. 1000' },
              ].map(f => (
                <div key={f.name}>
                  <label style={styles.label}>{f.name.toUpperCase()}</label>
                  <input name={f.name} placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                    style={styles.input} required />
                </div>
              ))}
            </div>
            <button type="submit" style={styles.btnPrimary}>Create Warehouse</button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: 'Total Warehouses', value: warehouses.length, icon: '🏭' },
          { label: 'Active', value: warehouses.filter(w => w.isActive).length, icon: '✅' },
          { label: 'Cities', value: [...new Set(warehouses.map(w => w.city))].length, icon: '📍' },
          { label: 'Total Capacity', value: warehouses.reduce((s, w) => s + w.capacity, 0), icon: '📦' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={{ fontSize: '24px' }}>{s.icon}</span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e94560' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Warehouse cards */}
      {loading ? (
        <div style={styles.loading}>Loading warehouses...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {warehouses.map(w => (
            <div key={w.id} style={{
              ...styles.card,
              borderLeft: `4px solid ${w.isActive ? '#e94560' : '#333'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>🏭</span>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                  backgroundColor: w.isActive ? 'rgba(74,222,128,0.1)' : 'rgba(100,100,100,0.1)',
                  color: w.isActive ? '#4ade80' : '#666',
                  border: `1px solid ${w.isActive ? 'rgba(74,222,128,0.3)' : '#333'}`
                }}>{w.isActive ? 'Active' : 'Inactive'}</span>
              </div>

              {/* Name + ID badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 700, margin: 0 }}>{w.name}</h3>
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '3px 8px', borderRadius: '4px' }}>
                  ID: {w.id}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div style={styles.detail}>📍 {w.city}</div>
                <div style={styles.detail}>🏠 {w.address}</div>
                <div style={styles.detail}>📦 Capacity: <span style={{ color: '#e94560' }}>{w.capacity}</span></div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => navigate('/uc3/stock')} style={styles.btnView}>View Stock</button>
                {role === 'ADMIN' && w.isActive && (
                  <button onClick={() => handleDeactivate(w.id)} style={styles.btnDanger}>Deactivate</button>
                )}
              </div>
            </div>
          ))}
          {warehouses.length === 0 && (
            <div style={{ ...styles.empty, gridColumn: '1/-1' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏭</div>
              No warehouses found
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
  btnSecondary: { padding: '10px 16px', backgroundColor: '#ffffff10', color: 'white', border: '1px solid #ffffff20', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  btnView: { padding: '5px 12px', backgroundColor: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  btnDanger: { padding: '5px 12px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' },
  formCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff15', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  label: { display: 'block', color: '#666', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  card: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px' },
  detail: { color: '#666', fontSize: '13px' },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  successMsg: { backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default WarehousesPage;