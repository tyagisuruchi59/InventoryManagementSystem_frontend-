// StockPro Inventory Management System
// UC6 - Movement Service | Page: Record Movement
// Developer: Suru | April 2026

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { movementAPI } from '../../api';

function RecordMovementPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    productId: '', warehouseId: '', movementType: 'STOCK_IN',
    quantity: '', referenceNumber: '', notes: '',
    performedBy: localStorage.getItem('stockpro_username') || ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await movementAPI.post('/api/movements', {
        productId:       parseInt(form.productId),
        warehouseId:     parseInt(form.warehouseId),
        movementType:    form.movementType,
        quantity:        parseInt(form.quantity),
        referenceNumber: form.referenceNumber,
        notes:           form.notes,
        performedBy:     form.performedBy,
        movementDate:    new Date().toISOString()
      });
      navigate('/uc6/movements');
    } catch (err) {
      const msg = err.response?.data || err.response?.status;
      setError(`Error recording movement: ${msg}`);
    }
    setLoading(false);
  };

  const typeInfo = {
    'STOCK_IN':    { color: '#4ade80', desc: 'Stock received into warehouse' },
    'STOCK_OUT':   { color: '#dc3545', desc: 'Stock dispatched from warehouse' },
    'TRANSFER_IN': { color: '#818cf8', desc: 'Stock transferred in from another warehouse' },
    'TRANSFER_OUT':{ color: '#ffab00', desc: 'Stock transferred out to another warehouse' },
    'ADJUSTMENT':  { color: '#00d4ff', desc: 'Stock count correction' },
    'WRITE_OFF':   { color: '#ff6b6b', desc: 'Stock written off / damaged' },
    'RETURN':      { color: '#a78bfa', desc: 'Stock returned to warehouse' },
  };

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <button onClick={() => navigate('/uc6/movements')} style={styles.backBtn}>← Back to Movements</button>
        <div style={styles.ucBadge}>UC6 · RECORD MOVEMENT</div>
        <h1 style={styles.title}>Record Stock Movement</h1>
        <p style={styles.subtitle}>Log an inventory movement for audit trail</p>

        {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            {/* Movement Type selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ ...styles.label, marginBottom: '10px', display: 'block' }}>MOVEMENT TYPE</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.entries(typeInfo).map(([type, info]) => (
                  <button key={type} type="button"
                    onClick={() => setForm({ ...form, movementType: type })}
                    style={{
                      padding: '10px 6px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                      backgroundColor: form.movementType === type ? `${info.color}20` : '#ffffff08',
                      border: form.movementType === type ? `2px solid ${info.color}` : '1px solid #ffffff15',
                      color: form.movementType === type ? info.color : '#666',
                      fontFamily: 'monospace', fontSize: '10px', fontWeight: 700
                    }}>
                    {type}
                  </button>
                ))}
              </div>
              <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                {typeInfo[form.movementType]?.desc}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={styles.label}>PRODUCT ID *</label>
                <input name="productId" type="number" placeholder="Enter product ID"
                  value={form.productId} onChange={handleChange} style={styles.input} required />
              </div>

              <div>
                <label style={styles.label}>WAREHOUSE ID *</label>
                <input name="warehouseId" type="number" placeholder="Enter warehouse ID"
                  value={form.warehouseId} onChange={handleChange} style={styles.input} required />
              </div>

              <div>
                <label style={styles.label}>QUANTITY *</label>
                <input name="quantity" type="number" placeholder="Enter quantity"
                  value={form.quantity} onChange={handleChange} style={styles.input} required />
              </div>

              <div>
                <label style={styles.label}>PERFORMED BY</label>
                <input name="performedBy" placeholder="Your username"
                  value={form.performedBy} onChange={handleChange} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>REFERENCE NUMBER</label>
                <input name="referenceNumber" placeholder="e.g. PO-001, GRN-002"
                  value={form.referenceNumber} onChange={handleChange} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>NOTES</label>
                <input name="notes" placeholder="Optional notes"
                  value={form.notes} onChange={handleChange} style={styles.input} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading} style={styles.btnPrimary}>
              {loading ? 'Recording...' : '+ Record Movement'}
            </button>
            <button type="button" onClick={() => navigate('/uc6/movements')} style={styles.btnGhost}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  backBtn: { backgroundColor: 'transparent', border: '1px solid #333', color: '#666', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '16px', fontSize: '13px' },
  ucBadge: { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title: { color: 'white', fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '24px' },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  section: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '24px', marginBottom: '20px' },
  label: { display: 'block', color: '#666', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { padding: '12px 24px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  btnGhost: { padding: '12px 24px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
};

export default RecordMovementPage;