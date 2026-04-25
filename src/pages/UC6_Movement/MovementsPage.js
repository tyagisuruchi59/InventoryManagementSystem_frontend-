// StockPro Inventory Management System
// UC6 - Movement Service | Page: Stock Movements
// Developer: Suru | April 2026

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movementAPI } from '../../api';

function MovementsPage() {
  const navigate = useNavigate();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadMovements(); }, []);

  const loadMovements = async () => {
    setLoading(true);
    try {
      const res = await movementAPI.get('/api/movements');
      setMovements(res.data);
    } catch (err) { setError('Could not load movements'); }
    setLoading(false);
  };

  const typeColor = (type) => {
    const map = {
      'STOCK_IN':    { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
      'STOCK_OUT':   { bg: 'rgba(220,53,69,0.1)',   color: '#dc3545', border: 'rgba(220,53,69,0.3)' },
      'TRANSFER_IN': { bg: 'rgba(99,102,241,0.1)',  color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
      'TRANSFER_OUT':{ bg: 'rgba(255,171,0,0.1)',   color: '#ffab00', border: 'rgba(255,171,0,0.3)' },
      'ADJUSTMENT':  { bg: 'rgba(0,212,255,0.1)',   color: '#00d4ff', border: 'rgba(0,212,255,0.3)' },
      'WRITE_OFF':   { bg: 'rgba(255,107,107,0.1)', color: '#ff6b6b', border: 'rgba(255,107,107,0.3)' },
      'RETURN':      { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.3)' },
    };
    return map[type] || { bg: 'rgba(100,100,100,0.1)', color: '#999', border: '#333' };
  };

  const filtered = filterType ? movements.filter(m => m.movementType === filterType) : movements;

  const stats = [
    { label: 'Total Movements', value: movements.length, icon: '📊' },
    { label: 'Stock In',        value: movements.filter(m => m.movementType === 'STOCK_IN').length, icon: '📥' },
    { label: 'Stock Out',       value: movements.filter(m => m.movementType === 'STOCK_OUT').length, icon: '📤' },
    { label: 'Transfers',       value: movements.filter(m => m.movementType === 'TRANSFER_IN' || m.movementType === 'TRANSFER_OUT').length, icon: '⇄' },
  ];

  const filterTypes = ['', 'STOCK_IN', 'STOCK_OUT', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'WRITE_OFF', 'RETURN'];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC6 · MOVEMENT SERVICE</div>
          <h1 style={styles.title}>Stock Movement Audit Trail</h1>
          <p style={styles.subtitle}>Track all inventory movements — IN, OUT, TRANSFER, ADJUST</p>
        </div>
        <button onClick={() => navigate('/uc6/record-movement')} style={styles.btnPrimary}>+ Record Movement</button>
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

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {filterTypes.map(t => (
          <button key={t} onClick={() => setFilterType(t)} style={{
            padding: '7px 16px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontFamily: 'monospace',
            backgroundColor: filterType === t ? '#e94560' : '#ffffff08',
            color: filterType === t ? 'white' : '#666',
            border: filterType === t ? 'none' : '1px solid #ffffff15'
          }}>{t || 'ALL'}</button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading movements...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Warehouse</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Reference</th>
                <th style={styles.th}>Performed By</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const tc = typeColor(m.movementType);
                return (
                  <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#0f0f23' : '#0d0d1a' }}>
                    <td style={styles.td}><span style={{ fontFamily: 'monospace', color: '#e94560' }}>#{m.id}</span></td>
                    <td style={styles.td}>
                      <span style={{ padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontFamily: 'monospace', backgroundColor: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                        {m.movementType}
                      </span>
                    </td>
                    <td style={styles.td}>Product #{m.productId}</td>
                    <td style={styles.td}>WH #{m.warehouseId}</td>
                    <td style={{ ...styles.td, color: m.movementType === 'STOCK_OUT' || m.movementType === 'TRANSFER_OUT' || m.movementType === 'WRITE_OFF' ? '#dc3545' : '#4ade80', fontWeight: 600 }}>
                      {m.movementType === 'STOCK_OUT' || m.movementType === 'TRANSFER_OUT' || m.movementType === 'WRITE_OFF' ? '-' : '+'}{m.quantity}
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>{m.referenceNumber || '—'}</td>
                    <td style={styles.td}>{m.performedBy}</td>
                    <td style={styles.td}>{new Date(m.movementDate).toLocaleDateString()}</td>
                    <td style={styles.td}>{m.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px' }}>📊</div>
              No movements found
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
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  tableWrapper: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#ffffff08' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '1.5px', color: '#666', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#999', borderBottom: '1px solid #ffffff08' },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default MovementsPage;