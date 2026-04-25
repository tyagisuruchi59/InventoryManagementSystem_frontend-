// StockPro Inventory Management System
// UC7 - Alert Service | Page: Send Alert
// Developer: Suru | April 2026

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertAPI } from '../../api';

function SendAlertPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState('single'); // single or bulk
  const [form, setForm] = useState({
    recipientId: '', title: '', message: '',
    severity: 'MEDIUM', alertType: 'SYSTEM'
  });
  const [bulkForm, setBulkForm] = useState({
    title: '', message: '', severity: 'MEDIUM',
    alertType: 'SYSTEM', recipientIds: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBulkChange = (e) => setBulkForm({ ...bulkForm, [e.target.name]: e.target.value });

  const handleSingle = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await alertAPI.post('/api/alert', {
        recipientId: parseInt(form.recipientId),
        title: form.title,
        message: form.message,
        severity: form.severity,
        alertType: form.alertType
      });
      setSuccess('Alert sent successfully!');
      setForm({ recipientId: '', title: '', message: '', severity: 'MEDIUM', alertType: 'SYSTEM' });
    } catch (err) {
      const msg = err.response?.data || err.response?.status;
      setError(`Error: ${msg}`);
    }
    setLoading(false);
  };

  const handleBulk = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const ids = bulkForm.recipientIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      await alertAPI.post('/api/alert/bulk', {
        recipientIds: ids,
        title: bulkForm.title,
        message: bulkForm.message,
        severity: bulkForm.severity,
        alertType: bulkForm.alertType
      });
      setSuccess(`Bulk alert sent to ${ids.length} recipients!`);
      setBulkForm({ title: '', message: '', severity: 'MEDIUM', alertType: 'SYSTEM', recipientIds: '' });
    } catch (err) {
      const msg = err.response?.data || err.response?.status;
      setError(`Error: ${msg}`);
    }
    setLoading(false);
  };

  const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const alertTypes = ['SYSTEM', 'LOW_STOCK', 'PURCHASE_ORDER', 'WAREHOUSE', 'SUPPLIER', 'MOVEMENT'];

  const severityColor = { LOW: '#4ade80', MEDIUM: '#ffab00', HIGH: '#dc3545', CRITICAL: '#e94560' };

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <button onClick={() => navigate('/uc7/alerts')} style={styles.backBtn}>← Back to Alerts</button>
        <div style={styles.ucBadge}>UC7 · SEND ALERT</div>
        <h1 style={styles.title}>Send Alert</h1>
        <p style={styles.subtitle}>Send notifications to system users</p>

        {error   && <div style={styles.errorMsg}>⚠️ {error}</div>}
        {success && <div style={styles.successMsg}>✅ {success}</div>}

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['single', 'bulk'].map(m => (
            <button key={m} type="button" onClick={() => setMode(m)} style={{
              padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
              backgroundColor: mode === m ? '#e94560' : '#ffffff08',
              color: mode === m ? 'white' : '#666',
              border: mode === m ? 'none' : '1px solid #ffffff15'
            }}>{m === 'single' ? '👤 Single' : '👥 Bulk'}</button>
          ))}
        </div>

        {mode === 'single' ? (
          <form onSubmit={handleSingle}>
            <div style={styles.section}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={styles.label}>RECIPIENT ID *</label>
                  <input name="recipientId" type="number" placeholder="User ID"
                    value={form.recipientId} onChange={handleChange} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>ALERT TYPE</label>
                  <select name="alertType" value={form.alertType} onChange={handleChange} style={{ ...styles.input, cursor: 'pointer' }}>
                    {alertTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={styles.label}>SEVERITY</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {severities.map(s => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, severity: s })} style={{
                        flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700,
                        backgroundColor: form.severity === s ? `${severityColor[s]}20` : '#ffffff08',
                        border: form.severity === s ? `2px solid ${severityColor[s]}` : '1px solid #ffffff15',
                        color: form.severity === s ? severityColor[s] : '#666'
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={styles.label}>TITLE *</label>
                  <input name="title" placeholder="Alert title"
                    value={form.title} onChange={handleChange} style={styles.input} required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={styles.label}>MESSAGE *</label>
                  <textarea name="message" placeholder="Alert message..."
                    value={form.message} onChange={handleChange}
                    style={{ ...styles.input, height: '100px', resize: 'vertical' }} required />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={loading} style={styles.btnPrimary}>
                {loading ? 'Sending...' : '🔔 Send Alert'}
              </button>
              <button type="button" onClick={() => navigate('/uc7/alerts')} style={styles.btnGhost}>Cancel</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleBulk}>
            <div style={styles.section}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div>
                  <label style={styles.label}>RECIPIENT IDs * (comma separated)</label>
                  <input name="recipientIds" placeholder="e.g. 1, 2, 3, 4"
                    value={bulkForm.recipientIds} onChange={handleBulkChange} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>ALERT TYPE</label>
                  <select name="alertType" value={bulkForm.alertType} onChange={handleBulkChange} style={{ ...styles.input, cursor: 'pointer' }}>
                    {alertTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>SEVERITY</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {severities.map(s => (
                      <button key={s} type="button" onClick={() => setBulkForm({ ...bulkForm, severity: s })} style={{
                        flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700,
                        backgroundColor: bulkForm.severity === s ? `${severityColor[s]}20` : '#ffffff08',
                        border: bulkForm.severity === s ? `2px solid ${severityColor[s]}` : '1px solid #ffffff15',
                        color: bulkForm.severity === s ? severityColor[s] : '#666'
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={styles.label}>TITLE *</label>
                  <input name="title" placeholder="Alert title"
                    value={bulkForm.title} onChange={handleBulkChange} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>MESSAGE *</label>
                  <textarea name="message" placeholder="Alert message..."
                    value={bulkForm.message} onChange={handleBulkChange}
                    style={{ ...styles.input, height: '100px', resize: 'vertical' }} required />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={loading} style={styles.btnPrimary}>
                {loading ? 'Sending...' : '👥 Send Bulk Alert'}
              </button>
              <button type="button" onClick={() => navigate('/uc7/alerts')} style={styles.btnGhost}>Cancel</button>
            </div>
          </form>
        )}
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
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  successMsg: { backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  section: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '24px', marginBottom: '20px' },
  label: { display: 'block', color: '#666', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { padding: '12px 24px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  btnGhost: { padding: '12px 24px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
};

export default SendAlertPage;