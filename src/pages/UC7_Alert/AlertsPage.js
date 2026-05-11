// StockPro Inventory Management System
// UC7 - Alert Service | Page: Alerts
// Developer: Suru | April 2026
// Description: Displays system-generated alerts only (LOW_STOCK, OVERSTOCK,
//              PO_PENDING, OVERDUE_RECEIPT). Alerts are generated automatically
//              by the backend IHostedService (Quartz.NET every 15 min).
//              Users can only Acknowledge / Mark as Read / Delete (ADMIN).

import React, { useState, useEffect } from 'react';
import { alertAPI } from '../../api';

// ─── severity config ───────────────────────────────────────────────────────────
const SEVERITY_CFG = {
  LOW:      { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.3)',  icon: 'ℹ️' },
  MEDIUM:   { bg: 'rgba(255,171,0,0.1)',   color: '#ffab00', border: 'rgba(255,171,0,0.3)',   icon: '⚠️' },
  HIGH:     { bg: 'rgba(220,53,69,0.1)',   color: '#dc3545', border: 'rgba(220,53,69,0.3)',   icon: '🔴' },
  CRITICAL: { bg: 'rgba(233,69,96,0.2)',   color: '#e94560', border: 'rgba(233,69,96,0.5)',   icon: '🚨' },
  // fallback for INFO (from doc: INFO / WARNING / CRITICAL)
  INFO:     { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', border: 'rgba(59,130,246,0.3)',  icon: 'ℹ️' },
  WARNING:  { bg: 'rgba(255,171,0,0.1)',   color: '#ffab00', border: 'rgba(255,171,0,0.3)',   icon: '⚠️' },
};

// ─── alert type labels (auto-generated types per document) ────────────────────
const TYPE_LABELS = {
  LOW_STOCK:       { label: 'Low Stock',        icon: '📦', color: '#ffab00' },
  OVERSTOCK:       { label: 'Overstock',         icon: '🏭', color: '#8b5cf6' },
  PO_PENDING:      { label: 'PO Pending',        icon: '📋', color: '#3b82f6' },
  OVERDUE_RECEIPT: { label: 'Overdue Receipt',   icon: '🕐', color: '#e94560' },
  SYSTEM:          { label: 'System',            icon: '⚙️', color: '#94a3b8' },
};

function AlertsPage() {
  const [alerts,    setAlerts]    = useState([]);
  const [unread,    setUnread]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [tab,       setTab]       = useState('all');       // 'all' | 'unacknowledged'
  const [typeFilter, setTypeFilter] = useState('');        // '' = all types
  const role = localStorage.getItem('stockpro_role');

  // ── load ────────────────────────────────────────────────────────────────────
  useEffect(() => { loadAlerts(); loadUnacknowledged(); }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertAPI.get('/api/alert');
      setAlerts(res.data);
    } catch {
      setError('Could not load alerts. Make sure Alert Service is running.');
    }
    setLoading(false);
  };

  const loadUnacknowledged = async () => {
    try {
      const res = await alertAPI.get('/api/alert/unacknowledged');
      setUnread(res.data);
    } catch { /* silent */ }
  };

  // ── actions ─────────────────────────────────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      await alertAPI.put(`/api/alert/${id}/read`);
      loadAlerts(); loadUnacknowledged();
    } catch { alert('Error marking as read'); }
  };

  const handleAcknowledge = async (id) => {
    try {
      await alertAPI.put(`/api/alert/${id}/acknowledge`);
      loadAlerts(); loadUnacknowledged();
    } catch { alert('Error acknowledging alert'); }
  };

  const handleMarkAllRead = async () => {
    try {
      await alertAPI.put('/api/alert/read-all');
      loadAlerts(); loadUnacknowledged();
    } catch { alert('Error marking all as read'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alert?')) return;
    try {
      await alertAPI.delete(`/api/alert/${id}`);
      loadAlerts(); loadUnacknowledged();
    } catch { alert('Error deleting alert'); }
  };

  // ── derived data ─────────────────────────────────────────────────────────────
  const base     = tab === 'unacknowledged' ? unread : alerts;
  const displayed = typeFilter ? base.filter(a => a.alertType === typeFilter) : base;

  const stats = [
    { label: 'Total Alerts',   value: alerts.length,                                          icon: '🔔', color: '#3b82f6' },
    { label: 'Unread',         value: alerts.filter(a => !a.isRead).length,                   icon: '📬', color: '#f59e0b' },
    { label: 'Unacknowledged', value: unread.length,                                           icon: '⚠️', color: '#e94560' },
    { label: 'Critical',       value: alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length, icon: '🚨', color: '#dc3545' },
  ];

  const typeCounts = Object.keys(TYPE_LABELS).reduce((acc, t) => {
    acc[t] = alerts.filter(a => a.alertType === t).length;
    return acc;
  }, {});

  return (
    <div style={styles.page}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC7 · ALERT SERVICE</div>
          <h1 style={styles.title}>
            Alert Centre
            {unread.length > 0 && (
              <span style={styles.unreadBadge}>{unread.length} new</span>
            )}
          </h1>
          <p style={styles.subtitle}>
            Alerts are generated automatically by the system every 15 minutes
            for low stock, overstock, pending PO approvals, and overdue receipts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <button onClick={loadAlerts} style={styles.btnRefresh}>↻ Refresh</button>
          {alerts.filter(a => !a.isRead).length > 0 && (
            <button onClick={handleMarkAllRead} style={styles.btnMarkAll}>✓ Mark All Read</button>
          )}
        </div>
      </div>

      {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

      {/* ── How alerts are generated info box ──────────────────────────────── */}
      <div style={styles.infoBox}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px' }}>⚙️</span>
          <span style={{ fontWeight: 700, color: '#3b82f6', fontSize: '13px', letterSpacing: '1px', fontFamily: 'monospace' }}>
            AUTO-GENERATED ALERT TYPES
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { type: 'LOW_STOCK',       desc: 'Triggered when product quantity < reorder level (every 15 min)' },
            { type: 'OVERSTOCK',       desc: 'Triggered when quantity exceeds maximum stock level' },
            { type: 'PO_PENDING',      desc: 'Sent to approvers when a PO is submitted for approval' },
            { type: 'OVERDUE_RECEIPT', desc: 'Sent when approved PO expected delivery date has passed' },
          ].map(({ type, desc }) => {
            const cfg = TYPE_LABELS[type];
            return (
              <div key={type} style={styles.infoItem}>
                <span style={{ fontSize: '16px' }}>{cfg.icon}</span>
                <div>
                  <div style={{ color: cfg.color, fontFamily: 'monospace', fontSize: '11px', fontWeight: 700 }}>{cfg.label}</div>
                  <div style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>{desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div style={styles.statsRow}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={{ fontSize: '22px' }}>{s.icon}</span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Type breakdown ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setTypeFilter('')}
          style={{ ...styles.typeBtn, ...(typeFilter === '' ? styles.typeBtnActive : {}) }}
        >
          ALL ({alerts.length})
        </button>
        {Object.entries(TYPE_LABELS).map(([type, cfg]) => (
          typeCounts[type] > 0 && (
            <button
              key={type}
              onClick={() => setTypeFilter(type === typeFilter ? '' : type)}
              style={{
                ...styles.typeBtn,
                ...(typeFilter === type ? { backgroundColor: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}50` } : {})
              }}
            >
              {cfg.icon} {cfg.label} ({typeCounts[type]})
            </button>
          )
        ))}
      </div>

      {/* ── Tab switcher ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all',            label: `All Alerts (${alerts.length})` },
          { key: 'unacknowledged', label: `Unacknowledged (${unread.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 20px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px',
            backgroundColor: tab === t.key ? '#e94560' : '#ffffff08',
            color: tab === t.key ? 'white' : '#666',
            border: tab === t.key ? 'none' : '1px solid #ffffff15',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Alert list ─────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <span>Loading alerts from Alert Service...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {displayed.map(a => {
            const sc  = SEVERITY_CFG[a.severity] || SEVERITY_CFG['LOW'];
            const tc  = TYPE_LABELS[a.alertType]  || TYPE_LABELS['SYSTEM'];
            return (
              <div
                key={a.id}
                style={{
                  ...styles.alertCard,
                  borderLeft: `4px solid ${sc.color}`,
                  opacity: a.isRead ? 0.65 : 1,
                  background: a.isRead ? '#0d0d1a' : '#0f0f23',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>

                  {/* Left — content */}
                  <div style={{ flex: 1 }}>
                    {/* badges row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {/* Severity badge */}
                      <span style={{
                        padding: '2px 10px', borderRadius: '20px', fontSize: '10px',
                        fontFamily: 'monospace', fontWeight: 700,
                        backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
                      }}>
                        {sc.icon} {a.severity}
                      </span>
                      {/* Type badge */}
                      <span style={{
                        padding: '2px 10px', borderRadius: '20px', fontSize: '10px',
                        fontFamily: 'monospace',
                        backgroundColor: `${tc.color}15`, color: tc.color, border: `1px solid ${tc.color}40`
                      }}>
                        {tc.icon} {tc.label}
                      </span>
                      {/* Unread dot */}
                      {!a.isRead && (
                        <span style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          backgroundColor: '#e94560', display: 'inline-block',
                          boxShadow: '0 0 6px #e94560'
                        }} />
                      )}
                      {/* Acknowledged */}
                      {a.isAcknowledged && (
                        <span style={{ color: '#4ade80', fontSize: '11px', fontFamily: 'monospace' }}>
                          ✓ Acknowledged
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0' }}>
                      {a.title}
                    </h3>

                    {/* Message */}
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                      {a.message}
                    </p>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={styles.meta}>🕐 {new Date(a.createdAt).toLocaleString()}</span>
                      <span style={styles.meta}>👤 Recipient #{a.recipientId}</span>
                      {a.relatedProductId   && <span style={styles.meta}>📦 Product #{a.relatedProductId}</span>}
                      {a.relatedWarehouseId && <span style={styles.meta}>🏭 Warehouse #{a.relatedWarehouseId}</span>}
                    </div>
                  </div>

                  {/* Right — action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    {!a.isRead && (
                      <button onClick={() => handleMarkRead(a.id)} style={styles.btnRead}>
                        📖 Mark Read
                      </button>
                    )}
                    {!a.isAcknowledged && (
                      <button onClick={() => handleAcknowledge(a.id)} style={styles.btnAck}>
                        ✓ Acknowledge
                      </button>
                    )}
                    {role === 'ADMIN' && (
                      <button onClick={() => handleDelete(a.id)} style={styles.btnDel}>
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {displayed.length === 0 && !loading && (
            <div style={styles.empty}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔔</div>
              <div style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                No alerts
              </div>
              <div style={{ color: '#666', fontSize: '13px', maxWidth: '400px', textAlign: 'center' }}>
                {tab === 'unacknowledged'
                  ? 'All alerts have been acknowledged.'
                  : 'No alerts yet. The system checks every 15 minutes for low stock, overstock, pending POs, and overdue receipts.'}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────
const styles = {
  page:       { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  ucBadge:    { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title:      { color: 'white', fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' },
  subtitle:   { color: '#666', fontSize: '13px', margin: 0, maxWidth: '560px', lineHeight: '1.5' },
  unreadBadge:{ backgroundColor: '#e94560', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', fontFamily: 'monospace' },

  btnRefresh: { padding: '9px 18px', backgroundColor: '#ffffff08', color: '#94a3b8', border: '1px solid #ffffff20', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 },
  btnMarkAll: { padding: '9px 18px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 },

  infoBox:    { backgroundColor: '#0f0f23', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '24px' },
  infoItem:   { display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: '#ffffff05', borderRadius: '8px', padding: '10px' },

  statsRow:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' },
  statCard:   { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },

  typeBtn:    { padding: '7px 14px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontFamily: 'monospace', backgroundColor: '#ffffff08', color: '#666', border: '1px solid #ffffff15', fontWeight: 600, transition: 'all 0.2s' },
  typeBtnActive: { backgroundColor: '#e9456020', color: '#e94560', border: '1px solid #e9456050' },

  alertCard:  { border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', transition: 'background 0.2s' },

  btnRead:    { padding: '6px 12px', backgroundColor: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },
  btnAck:     { padding: '6px 12px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },
  btnDel:     { padding: '6px 12px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },

  meta:       { fontSize: '11px', color: '#5a6583', fontFamily: 'monospace' },
  errorMsg:   { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  loading:    { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '60px', color: '#666' },
  spinner:    { width: '20px', height: '20px', border: '2px solid #333', borderTop: '2px solid #e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty:      { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px', color: '#666' },
};

export default AlertsPage;