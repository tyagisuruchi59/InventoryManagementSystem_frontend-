// StockPro Inventory Management System
// UC4 - Purchase Service | Page: Purchase Orders
// Developer: Suru | April 2026
// Workflow: Draft → (Submit) → Pending → (Approve) → Approved → Received
//           Any open PO → (Cancel)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseAPI } from '../../api';

function PurchasePage() {
  const navigate = useNavigate();
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // tracks which PO is being actioned
  const role = localStorage.getItem('stockpro_role');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await purchaseAPI.get('/api/purchase-orders');
      setOrders(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  // ── SUBMIT: Draft → Pending ──────────────────────────────────────────────────
  const handleSubmit = async (id) => {
    if (!window.confirm('Submit this PO for approval?')) return;
    setActionLoading(id);
    try {
      await purchaseAPI.put(`/api/purchase-orders/${id}/submit`);
      loadOrders();
    } catch (err) {
      const msg = err.response?.data || err.response?.status || 'Unknown error';
      alert(`Error submitting PO: ${msg}`);
    }
    setActionLoading(null);
  };

  // ── APPROVE: Pending → Approved ──────────────────────────────────────────────
  const handleApprove = async (id) => {
    if (!window.confirm('Approve this PO?')) return;
    setActionLoading(id);
    try {
      await purchaseAPI.put(`/api/purchase-orders/${id}/approve`);
      loadOrders();
    } catch (err) {
      const msg = err.response?.data || err.response?.status || 'Unknown error';
      alert(`Error approving PO: ${msg}`);
    }
    setActionLoading(null);
  };

  // ── CANCEL ───────────────────────────────────────────────────────────────────
  const handleCancel = async (id) => {
    const reason = window.prompt('Enter cancellation reason:');
    if (!reason) return;
    setActionLoading(id);
    try {
      await purchaseAPI.put(`/api/purchase-orders/${id}/cancel`, { reason });
      loadOrders();
    } catch (err) {
      const msg = err.response?.data || err.response?.status || 'Unknown error';
      alert(`Error cancelling PO: ${msg}`);
    }
    setActionLoading(null);
  };

  // ── helpers ──────────────────────────────────────────────────────────────────
  const isOverdue = (po) => {
    if (!po.expectedDate) return false;
    if (['FullyReceived', 'Cancelled'].includes(po.status)) return false;
    const exp = new Date(po.expectedDate);
    exp.setHours(0, 0, 0, 0);
    return exp < today;
  };

  const statusCfg = {
    Draft:             { bg: 'rgba(100,100,100,0.15)', color: '#94a3b8', border: '#333',                    label: 'Draft' },
    Pending:           { bg: 'rgba(255,171,0,0.15)',   color: '#ffab00', border: 'rgba(255,171,0,0.4)',      label: 'Pending' },
    Approved:          { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80', border: 'rgba(74,222,128,0.4)',     label: 'Approved' },
    FullyReceived:     { bg: 'rgba(0,212,255,0.15)',   color: '#00d4ff', border: 'rgba(0,212,255,0.4)',      label: 'Fully Received' },
    PartiallyReceived: { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8', border: 'rgba(99,102,241,0.4)',     label: 'Partial' },
    Cancelled:         { bg: 'rgba(220,53,69,0.15)',   color: '#dc3545', border: 'rgba(220,53,69,0.4)',      label: 'Cancelled' },
  };

  const filtered = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders;

  const overduePOs = orders.filter(isOverdue);

  const stats = [
    { label: 'Total POs',  value: orders.length,                                      icon: '📋', color: '#3b82f6' },
    { label: 'Draft',      value: orders.filter(o => o.status === 'Draft').length,    icon: '✏️', color: '#94a3b8' },
    { label: 'Pending',    value: orders.filter(o => o.status === 'Pending').length,  icon: '⏳', color: '#ffab00' },
    { label: 'Approved',   value: orders.filter(o => o.status === 'Approved').length, icon: '✅', color: '#4ade80' },
  ];

  const canSubmit  = (o) => o.status === 'Draft';
  const canApprove = (o) => o.status === 'Pending' && ['ADMIN', 'MANAGER'].includes(role);
  const canCancel  = (o) => ['Draft', 'Pending'].includes(o.status);

  return (
    <div style={s.page}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={s.header}>
        <div>
          <div style={s.ucBadge}>UC4 · PURCHASE SERVICE</div>
          <h1 style={s.title}>Purchase Orders</h1>
          <p style={s.subtitle}>Manage procurement lifecycle — Draft → Pending → Approved → Received</p>
        </div>
        <button onClick={() => navigate('/uc4/create-po')} style={s.btnPrimary}>+ Create PO</button>
      </div>

      {/* ── Overdue warning banner ──────────────────────────────────────────── */}
      {overduePOs.length > 0 && (
        <div style={s.overdueBox}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>🕐</span>
            <span style={{ color: '#e94560', fontWeight: 700, fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>
              {overduePOs.length} OVERDUE PO{overduePOs.length > 1 ? 'S' : ''} — Expected delivery date has passed!
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {overduePOs.map(po => (
              <span key={po.id} style={s.overduePill}>
                PO #{po.id} — Expected: {new Date(po.expectedDate).toLocaleDateString('en-IN')}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '10px', color: '#666', fontSize: '12px', fontFamily: 'monospace' }}>
            ⚙️ The backend IHostedService will automatically generate OVERDUE_RECEIPT alerts for these POs at 09:00 daily.
          </div>
        </div>
      )}

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div style={s.statsRow}>
        {stats.map((stat, i) => (
          <div key={i} style={s.statCard}>
            <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Workflow diagram ────────────────────────────────────────────────── */}
      <div style={s.workflowBox}>
        <span style={{ color: '#666', fontSize: '11px', fontFamily: 'monospace', marginRight: '8px' }}>WORKFLOW:</span>
        {['Draft', '→', 'Pending', '→', 'Approved', '→', 'FullyReceived'].map((step, i) => (
          <span key={i} style={{
            color: step === '→' ? '#333' : '#e94560',
            fontFamily: 'monospace', fontSize: '12px', fontWeight: 600,
            backgroundColor: step === '→' ? 'transparent' : 'rgba(233,69,96,0.1)',
            padding: step === '→' ? '0 4px' : '4px 12px',
            borderRadius: '4px',
            border: step === '→' ? 'none' : '1px solid rgba(233,69,96,0.25)',
          }}>{step}</span>
        ))}
        <span style={{ color: '#666', fontSize: '11px', marginLeft: '8px', fontFamily: 'monospace' }}>or → Cancelled</span>

        {/* Role hint */}
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#5a6583', fontFamily: 'monospace' }}>
          {role === 'ADMIN' || role === 'MANAGER'
            ? '✓ You can Submit & Approve'
            : '📋 You can Submit POs — Approval requires ADMIN/MANAGER'}
        </span>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['', 'Draft', 'Pending', 'Approved', 'FullyReceived', 'PartiallyReceived', 'Cancelled'].map(st => (
          <button key={st} onClick={() => setFilterStatus(st)} style={{
            padding: '7px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'monospace',
            backgroundColor: filterStatus === st ? '#e94560' : '#ffffff08',
            color: filterStatus === st ? 'white' : '#666',
            border: filterStatus === st ? 'none' : '1px solid #ffffff15',
            fontWeight: filterStatus === st ? 700 : 400,
          }}>
            {st || 'ALL'}
            {st && <span style={{ marginLeft: '4px', opacity: 0.7 }}>
              ({orders.filter(o => o.status === st).length})
            </span>}
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={s.loading}>
          <div style={s.spinner} />
          Loading purchase orders...
        </div>
      ) : (
        <div style={s.tableWrapper}>
          <table style={s.table}>
            <thead>
              <tr style={s.tableHead}>
                <th style={s.th}>PO ID</th>
                <th style={s.th}>Supplier</th>
                <th style={s.th}>Warehouse</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Total Amount</th>
                <th style={s.th}>Order Date</th>
                <th style={s.th}>Expected Date</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const sc      = statusCfg[o.status] || statusCfg['Draft'];
                const overdue = isOverdue(o);
                const busy    = actionLoading === o.id;
                return (
                  <tr
                    key={o.id}
                    style={{
                      backgroundColor: overdue
                        ? 'rgba(233,69,96,0.04)'
                        : i % 2 === 0 ? '#0f0f23' : '#0d0d1a',
                      borderLeft: overdue ? '3px solid #e94560' : '3px solid transparent',
                    }}
                  >
                    <td style={s.td}>
                      <span style={{ fontFamily: 'monospace', color: '#e94560', fontWeight: 700 }}>#{o.id}</span>
                      {overdue && <span style={s.overdueTag}>OVERDUE</span>}
                    </td>
                    <td style={s.td}>{o.supplierName || `Supplier #${o.supplierId}`}</td>
                    <td style={s.td}>{o.warehouseName || `WH #${o.warehouseId}`}</td>
                    <td style={s.td}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                        fontFamily: 'monospace', fontWeight: 600,
                        backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
                      }}>
                        {sc.label}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: '#4ade80', fontWeight: 700 }}>
                      ₹{Number(o.totalAmount).toLocaleString('en-IN')}
                    </td>
                    <td style={s.td}>
                      {new Date(o.orderDate).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ ...s.td, color: overdue ? '#e94560' : '#94a3b8', fontWeight: overdue ? 700 : 400 }}>
                      {o.expectedDate
                        ? <>
                            {new Date(o.expectedDate).toLocaleDateString('en-IN')}
                            {overdue && <span style={{ marginLeft: '6px', fontSize: '12px' }}>⚠️</span>}
                          </>
                        : '—'}
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {/* SUBMIT — Draft → Pending */}
                        {canSubmit(o) && (
                          <button
                            onClick={() => handleSubmit(o.id)}
                            disabled={busy}
                            style={s.btnSubmit}
                            title="Submit for approval"
                          >
                            {busy ? '...' : '📤 Submit'}
                          </button>
                        )}
                        {/* APPROVE — Pending → Approved (ADMIN/MANAGER only) */}
                        {canApprove(o) && (
                          <button
                            onClick={() => handleApprove(o.id)}
                            disabled={busy}
                            style={s.btnApprove}
                            title="Approve PO"
                          >
                            {busy ? '...' : '✓ Approve'}
                          </button>
                        )}
                        {/* CANCEL */}
                        {canCancel(o) && (
                          <button
                            onClick={() => handleCancel(o.id)}
                            disabled={busy}
                            style={s.btnCancel}
                            title="Cancel PO"
                          >
                            {busy ? '...' : '✕ Cancel'}
                          </button>
                        )}
                        {/* No actions available */}
                        {!canSubmit(o) && !canApprove(o) && !canCancel(o) && (
                          <span style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={s.empty}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
              <div style={{ color: 'white', fontWeight: 600, marginBottom: '6px' }}>No purchase orders found</div>
              <div style={{ color: '#666', fontSize: '13px' }}>
                {filterStatus ? `No POs with status "${filterStatus}"` : 'Create your first PO using the + Create PO button'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Pending approval notice ─────────────────────────────────────────── */}
      {orders.filter(o => o.status === 'Pending').length > 0 && (
        <div style={s.pendingBox}>
          <span style={{ fontSize: '16px' }}>⏳</span>
          <div>
            <div style={{ color: '#ffab00', fontWeight: 700, fontSize: '13px', marginBottom: '3px' }}>
              {orders.filter(o => o.status === 'Pending').length} PO(s) awaiting approval
            </div>
            <div style={{ color: '#666', fontSize: '12px', fontFamily: 'monospace' }}>
              Backend will auto-generate PO_PENDING alerts for approvers (ADMIN/MANAGER).
              {role !== 'ADMIN' && role !== 'MANAGER'
                ? ' Contact your manager to approve.'
                : ' You can approve them in the table above.'}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  page:        { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  ucBadge:     { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title:       { color: 'white', fontSize: '32px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle:    { color: '#666', fontSize: '14px', margin: 0 },
  btnPrimary:  { padding: '10px 20px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  btnSubmit:   { padding: '5px 11px', backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.4)', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 },
  btnApprove:  { padding: '5px 11px', backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 },
  btnCancel:   { padding: '5px 11px', backgroundColor: 'rgba(220,53,69,0.1)',   color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)',   borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 },
  statsRow:    { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  statCard:    { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  workflowBox: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  tableWrapper:{ backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  tableHead:   { backgroundColor: '#ffffff06' },
  th:          { padding: '14px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '1.5px', color: '#666', fontWeight: 700, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td:          { padding: '13px 16px', fontSize: '13px', color: '#94a3b8', borderBottom: '1px solid #ffffff08' },
  overdueBox:  { backgroundColor: 'rgba(233,69,96,0.07)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' },
  overduePill: { backgroundColor: 'rgba(233,69,96,0.15)', color: '#e94560', border: '1px solid rgba(233,69,96,0.4)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontFamily: 'monospace' },
  overdueTag:  { marginLeft: '8px', backgroundColor: 'rgba(233,69,96,0.2)', color: '#e94560', fontSize: '9px', fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px' },
  pendingBox:  { marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: 'rgba(255,171,0,0.07)', border: '1px solid rgba(255,171,0,0.25)', borderRadius: '10px', padding: '14px 18px' },
  loading:     { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '60px', color: '#666' },
  spinner:     { width: '18px', height: '18px', border: '2px solid #333', borderTop: '2px solid #e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  empty:       { textAlign: 'center', padding: '60px', color: '#666' },
};

export default PurchasePage;