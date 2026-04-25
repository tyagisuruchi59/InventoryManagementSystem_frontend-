// StockPro Inventory Management System
// UC7 - Alert Service | Page: Alerts
// Developer: Suru | April 2026

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertAPI } from '../../api';

function AlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [unread, setUnread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const role = localStorage.getItem('stockpro_role');

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertAPI.get('/api/alert');
      setAlerts(res.data);
    } catch (err) { setError('Could not load alerts'); }
    setLoading(false);
  };

  const loadUnacknowledged = async () => {
    try {
      const res = await alertAPI.get('/api/alert/unacknowledged');
      setUnread(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { loadUnacknowledged(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await alertAPI.put(`/api/alert/${id}/read`);
      loadAlerts();
    } catch { alert('Error marking as read'); }
  };

  const handleAcknowledge = async (id) => {
    try {
      await alertAPI.put(`/api/alert/${id}/acknowledge`);
      loadAlerts();
      loadUnacknowledged();
    } catch { alert('Error acknowledging'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alert?')) return;
    try {
      await alertAPI.delete(`/api/alert/${id}`);
      loadAlerts();
    } catch { alert('Error deleting'); }
  };

  const severityColor = (severity) => {
    const map = {
      'LOW':      { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
      'MEDIUM':   { bg: 'rgba(255,171,0,0.1)',   color: '#ffab00', border: 'rgba(255,171,0,0.3)' },
      'HIGH':     { bg: 'rgba(220,53,69,0.1)',   color: '#dc3545', border: 'rgba(220,53,69,0.3)' },
      'CRITICAL': { bg: 'rgba(233,69,96,0.2)',   color: '#e94560', border: 'rgba(233,69,96,0.5)' },
    };
    return map[severity] || map['LOW'];
  };

  const displayed = tab === 'unacknowledged' ? unread : alerts;

  const stats = [
    { label: 'Total Alerts',      value: alerts.length, icon: '🔔' },
    { label: 'Unacknowledged',    value: unread.length, icon: '⚠️' },
    { label: 'Critical',          value: alerts.filter(a => a.severity === 'CRITICAL').length, icon: '🚨' },
    { label: 'High',              value: alerts.filter(a => a.severity === 'HIGH').length, icon: '🔴' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC7 · ALERT SERVICE</div>
          <h1 style={styles.title}>Alert Management</h1>
          <p style={styles.subtitle}>System notifications and inventory alerts</p>
        </div>
        {(role === 'ADMIN' || role === 'MANAGER') && (
          <button onClick={() => navigate('/uc7/send-alert')} style={styles.btnPrimary}>+ Send Alert</button>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'unacknowledged'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace',
            backgroundColor: tab === t ? '#e94560' : '#ffffff08',
            color: tab === t ? 'white' : '#666',
            border: tab === t ? 'none' : '1px solid #ffffff15',
            textTransform: 'uppercase', letterSpacing: '1px'
          }}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading alerts...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayed.map(a => {
            const sc = severityColor(a.severity);
            return (
              <div key={a.id} style={{
                ...styles.alertCard,
                borderLeft: `4px solid ${sc.color}`,
                opacity: a.isRead ? 0.7 : 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontFamily: 'monospace', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {a.severity}
                      </span>
                      <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontFamily: 'monospace', backgroundColor: '#ffffff08', color: '#666', border: '1px solid #ffffff15' }}>
                        {a.alertType}
                      </span>
                      {!a.isRead && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e94560', display: 'inline-block' }} />
                      )}
                    </div>
                    <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 600, margin: '0 0 6px 0' }}>{a.title}</h3>
                    <p style={{ color: '#666', fontSize: '13px', margin: '0 0 8px 0' }}>{a.message}</p>
                    <div style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace' }}>
                      {new Date(a.createdAt).toLocaleString()} · Recipient #{a.recipientId}
                      {a.isAcknowledged && <span style={{ color: '#4ade80', marginLeft: '10px' }}>✓ Acknowledged</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginLeft: '16px', flexShrink: 0 }}>
                    {!a.isRead && (
                      <button onClick={() => handleMarkRead(a.id)} style={styles.btnRead}>Mark Read</button>
                    )}
                    {!a.isAcknowledged && (
                      <button onClick={() => handleAcknowledge(a.id)} style={styles.btnAck}>Acknowledge</button>
                    )}
                    {role === 'ADMIN' && (
                      <button onClick={() => handleDelete(a.id)} style={styles.btnDel}>✕</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {displayed.length === 0 && (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px' }}>🔔</div>
              No alerts found
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
  alertCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px' },
  btnRead: { padding: '5px 10px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  btnAck: { padding: '5px 10px', backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  btnDel: { padding: '5px 10px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  loading: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default AlertsPage;