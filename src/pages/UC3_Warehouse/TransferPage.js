// StockPro Inventory Management System
// UC3 - Warehouse Service | Page: Stock Transfer
// Developer: Suru | April 2026
// Description: POST /api/warehouse/transfer → inter-warehouse stock transfer

import React, { useState, useEffect } from 'react';
import { warehouseAPI } from '../../api';

function TransferPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    productId: '', fromWarehouseId: '', toWarehouseId: '',
    quantity: '', reason: '', transferredBy: localStorage.getItem('stockpro_username') || ''
  });

  useEffect(() => { loadWarehouses(); loadHistory(); }, []);

  const loadWarehouses = async () => {
    try {
      const res = await warehouseAPI.get('/api/warehouse');
      setWarehouses(res.data);
    } catch (err) { console.log(err); }
  };

  const loadHistory = async () => {
    try {
      const res = await warehouseAPI.get('/api/warehouse/transfer/history');
      setHistory(res.data);
    } catch (err) { console.log(err); }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await warehouseAPI.post('/api/warehouse/transfer', {
        productId: parseInt(form.productId),
        fromWarehouseId: parseInt(form.fromWarehouseId),
        toWarehouseId: parseInt(form.toWarehouseId),
        quantity: parseInt(form.quantity),
        reason: form.reason,
        transferredBy: form.transferredBy
      });
      setSuccess('Stock transferred successfully!');
      setForm({ productId: '', fromWarehouseId: '', toWarehouseId: '', quantity: '', reason: '', transferredBy: localStorage.getItem('stockpro_username') || '' });
      loadHistory();
    } catch (err) {
      setError(err.response?.data || 'Transfer failed. Check stock availability.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC3 · STOCK TRANSFER</div>
          <h1 style={styles.title}>Inter-Warehouse Transfer</h1>
          <p style={styles.subtitle}>Move stock between warehouse locations</p>
        </div>
      </div>

      {error   && <div style={styles.errorMsg}>⚠️ {error}</div>}
      {success && <div style={styles.successMsg}>✅ {success}</div>}

      {/* Transfer form */}
      <div style={styles.formCard}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>⇄ TRANSFER STOCK</h3>
        <form onSubmit={handleTransfer}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={styles.label}>PRODUCT ID</label>
              <input name="productId" type="number" placeholder="Enter product ID"
                value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
                style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>QUANTITY TO TRANSFER</label>
              <input name="quantity" type="number" placeholder="Enter quantity"
                value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>FROM WAREHOUSE</label>
              <select name="fromWarehouseId" value={form.fromWarehouseId}
                onChange={e => setForm({ ...form, fromWarehouseId: e.target.value })}
                style={{ ...styles.input, cursor: 'pointer' }} required>
                <option value="">-- Select source warehouse --</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} — {w.city}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>TO WAREHOUSE</label>
              <select name="toWarehouseId" value={form.toWarehouseId}
                onChange={e => setForm({ ...form, toWarehouseId: e.target.value })}
                style={{ ...styles.input, cursor: 'pointer' }} required>
                <option value="">-- Select destination warehouse --</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} — {w.city}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>REASON</label>
              <input name="reason" placeholder="Reason for transfer e.g. Rebalancing"
                value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                style={styles.input} required />
            </div>
            <div>
              <label style={styles.label}>TRANSFERRED BY</label>
              <input name="transferredBy" placeholder="Your username"
                value={form.transferredBy} onChange={e => setForm({ ...form, transferredBy: e.target.value })}
                style={styles.input} required />
            </div>
          </div>
          <button type="submit" disabled={loading} style={styles.btnPrimary}>
            {loading ? 'Transferring...' : '⇄ Transfer Stock'}
          </button>
        </form>
      </div>

      {/* Transfer history */}
      <div>
        <h3 style={{ color: 'white', marginBottom: '16px', fontFamily: 'monospace', letterSpacing: '1px' }}>TRANSFER HISTORY</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Reason</th>
                <th style={styles.th}>By</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((t, i) => (
                <tr key={t.id} style={{ backgroundColor: i % 2 === 0 ? '#0f0f23' : '#0d0d1a' }}>
                  <td style={styles.td}><span style={{ fontFamily: 'monospace', color: '#e94560' }}>#{t.id}</span></td>
                  <td style={styles.td}>Product #{t.productId}</td>
                  <td style={styles.td}>WH #{t.fromWarehouseId}</td>
                  <td style={styles.td}>WH #{t.toWarehouseId}</td>
                  <td style={{ ...styles.td, color: '#4ade80', fontWeight: 600 }}>{t.quantity}</td>
                  <td style={styles.td}>{t.reason}</td>
                  <td style={styles.td}>{t.transferredBy}</td>
                  <td style={styles.td}>{new Date(t.transferredAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && <div style={styles.empty}><div style={{ fontSize: '40px' }}>⇄</div>No transfers yet</div>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  ucBadge: { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title: { color: 'white', fontSize: '32px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  btnPrimary: { padding: '12px 24px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  formCard: { backgroundColor: '#0f0f23', border: '1px solid rgba(233,69,96,0.2)', borderRadius: '12px', padding: '24px', marginBottom: '30px' },
  label: { display: 'block', color: '#666', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  tableWrapper: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#ffffff08' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '1.5px', color: '#666', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#999', borderBottom: '1px solid #ffffff08' },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  successMsg: { backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default TransferPage;