// StockPro Inventory Management System
// UC4 - Purchase Service | Page: Purchase Orders
// Developer: Suru | April 2026

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseAPI } from '../../api';

function PurchasePage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const role = localStorage.getItem('stockpro_role');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await purchaseAPI.get('/api/purchase-orders');
      setOrders(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this PO?')) return;
    try {
      await purchaseAPI.put(`/api/purchase-orders/${id}/approve`);
      loadOrders();
    } catch { alert('Error approving PO'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this PO?')) return;
    try {
      await purchaseAPI.put(`/api/purchase-orders/${id}/cancel`);
      loadOrders();
    } catch { alert('Error cancelling PO'); }
  };

  const statusColor = (status) => {
    const map = {
      'Draft':             { bg: 'rgba(100,100,100,0.1)', color: '#999',    border: '#333' },
      'Pending':           { bg: 'rgba(255,171,0,0.1)',   color: '#ffab00', border: 'rgba(255,171,0,0.3)' },
      'Approved':          { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
      'FullyReceived':     { bg: 'rgba(0,212,255,0.1)',   color: '#00d4ff', border: 'rgba(0,212,255,0.3)' },
      'PartiallyReceived': { bg: 'rgba(99,102,241,0.1)',  color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
      'Cancelled':         { bg: 'rgba(220,53,69,0.1)',   color: '#dc3545', border: 'rgba(220,53,69,0.3)' },
    };
    return map[status] || map['Draft'];
  };

  const filtered = filterStatus ? orders.filter(o => o.status === filterStatus) : orders;

  const stats = [
    { label: 'Total POs',  value: orders.length, icon: '📋' },
    { label: 'Draft',      value: orders.filter(o => o.status === 'Draft').length, icon: '✏️' },
    { label: 'Pending',    value: orders.filter(o => o.status === 'Pending').length, icon: '⏳' },
    { label: 'Approved',   value: orders.filter(o => o.status === 'Approved').length, icon: '✅' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC4 · PURCHASE SERVICE</div>
          <h1 style={styles.title}>Purchase Orders</h1>
          <p style={styles.subtitle}>Manage procurement lifecycle — Draft → Pending → Approved → Received</p>
        </div>
        <button onClick={() => navigate('/uc4/create-po')} style={styles.btnPrimary}>+ Create PO</button>
      </div>

      <div style={styles.statsRow}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={{ fontSize: '24px' }}>{s.icon}</span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e94560' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Workflow */}
      <div style={{ backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '10px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace' }}>WORKFLOW:</span>
        {['Draft', '→', 'Approved', '→', 'FullyReceived'].map((s, i) => (
          <span key={i} style={{ color: s === '→' ? '#333' : '#e94560', fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, backgroundColor: s === '→' ? 'transparent' : 'rgba(233,69,96,0.1)', padding: s === '→' ? '0' : '4px 10px', borderRadius: '4px' }}>{s}</span>
        ))}
        <span style={{ color: '#666', fontSize: '11px', marginLeft: 'auto', fontFamily: 'monospace' }}>or → Cancelled</span>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['', 'Draft', 'Approved', 'FullyReceived', 'PartiallyReceived', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '7px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace', backgroundColor: filterStatus === s ? '#e94560' : '#ffffff08', color: filterStatus === s ? 'white' : '#666', border: filterStatus === s ? 'none' : '1px solid #ffffff15' }}>
            {s || 'ALL'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading purchase orders...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>PO ID</th>
                <th style={styles.th}>Supplier</th>
                <th style={styles.th}>Warehouse</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Total Amount</th>
                <th style={styles.th}>Order Date</th>
                <th style={styles.th}>Expected Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const sc = statusColor(o.status);
                return (
                  <tr key={o.id} style={{ backgroundColor: i % 2 === 0 ? '#0f0f23' : '#0d0d1a' }}>
                    <td style={styles.td}><span style={{ fontFamily: 'monospace', color: '#e94560' }}>#{o.id}</span></td>
                    <td style={styles.td}>Supplier #{o.supplierId}</td>
                    <td style={styles.td}>WH #{o.warehouseId}</td>
                    <td style={styles.td}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontFamily: 'monospace', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: '#4ade80', fontWeight: 600 }}>₹{o.totalAmount}</td>
                    <td style={styles.td}>{new Date(o.orderDate).toLocaleDateString()}</td>
                    <td style={styles.td}>{o.expectedDate ? new Date(o.expectedDate).toLocaleDateString() : '—'}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {o.status === 'Draft' && (role === 'ADMIN' || role === 'MANAGER') && (
                          <button onClick={() => handleApprove(o.id)} style={styles.btnApprove}>Approve</button>
                        )}
                        {(o.status === 'Draft') && (
                          <button onClick={() => handleCancel(o.id)} style={styles.btnCancel}>Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={styles.empty}><div style={{ fontSize: '48px' }}>📋</div>No purchase orders found</div>}
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
  btnApprove: { padding: '4px 10px', backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  btnCancel: { padding: '4px 10px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  tableWrapper: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#ffffff08' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '1.5px', color: '#666', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#999', borderBottom: '1px solid #ffffff08' },
  loading: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default PurchasePage;