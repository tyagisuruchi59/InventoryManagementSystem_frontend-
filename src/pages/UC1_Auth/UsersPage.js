// StockPro Inventory Management System
// UC1 - Auth Service | Page: Users Management
// Developer: Suru | April 2026
// Description: View all users, change role, deactivate

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';

function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const currentUser = localStorage.getItem('stockpro_username');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await authAPI.get('/api/auth/users');
      setUsers(res.data);
    } catch {
      setError('Could not load users. Make sure Auth Service is running and you are logged in as ADMIN.');
    }
    setLoading(false);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await authAPI.put(`/api/auth/users/${id}/deactivate`);
      loadUsers();
    } catch { alert('Failed to deactivate'); }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await authAPI.put(`/api/auth/users/${id}/role`, { role: newRole });
      loadUsers();
    } catch { alert('Failed to update role'); }
  };

  const isActive = (u) => u.isActive !== false;

  const roleConfig = {
    ADMIN:   { color: '#e94560', bg: 'rgba(233,69,96,0.1)',   border: 'rgba(233,69,96,0.3)' },
    MANAGER: { color: '#ffab00', bg: 'rgba(255,171,0,0.1)',   border: 'rgba(255,171,0,0.3)' },
    OFFICER: { color: '#818cf8', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.3)' },
    STAFF:   { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)' },
  };

  const stats = [
    { label: 'Total Users',  value: users.length,                                    icon: '👥', color: '#3b82f6' },
    { label: 'Active',       value: users.filter(u => isActive(u)).length,           icon: '✅', color: '#4ade80' },
    { label: 'Admins',       value: users.filter(u => u.role === 'ADMIN').length,    icon: '🔐', color: '#e94560' },
    { label: 'Staff',        value: users.filter(u => u.role === 'STAFF').length,    icon: '👤', color: '#ffab00' },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC1 · AUTH SERVICE</div>
          <h1 style={styles.title}>User Management</h1>
          <p style={styles.subtitle}>Manage system users, roles and access control</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadUsers} style={styles.btnSecondary}>↻ Refresh</button>
          <button onClick={() => navigate('/uc1/register')} style={styles.btnPrimary}>+ Register User</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {stats.map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={{ fontSize: '24px' }}>{s.icon}</span>
            <div style={{ fontSize: '32px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#666', fontFamily: 'monospace', letterSpacing: '1px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner} />
          Loading users...
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          {/* Table header */}
          <div style={styles.tableHeader}>
            <span style={{ color: 'white', fontWeight: 700 }}>👥 All Users ({users.length})</span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>USER</th>
                <th style={styles.th}>ROLE</th>
                <th style={styles.th}>STATUS</th>
                <th style={styles.th}>CHANGE ROLE</th>
                <th style={styles.th}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rc = roleConfig[u.role] || roleConfig.STAFF;
                const active = isActive(u);
                return (
                  <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? '#0f0f23' : '#0d0d1a' }}>

                    {/* User */}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          backgroundColor: rc.bg, border: `1px solid ${rc.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: rc.color, fontWeight: 700, fontSize: '14px'
                        }}>
                          {u.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                            {u.username}
                            {u.username === currentUser && (
                              <span style={{ marginLeft: '8px', fontSize: '10px', color: '#4ade80', fontFamily: 'monospace' }}>YOU</span>
                            )}
                          </div>
                          <div style={{ color: '#444', fontSize: '11px', fontFamily: 'monospace' }}>ID #{u.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td style={styles.td}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                        fontFamily: 'monospace', fontWeight: 700,
                        backgroundColor: rc.bg, color: rc.color, border: `1px solid ${rc.border}`
                      }}>
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={styles.td}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
                        fontFamily: 'monospace',
                        backgroundColor: active ? 'rgba(74,222,128,0.1)' : 'rgba(220,53,69,0.1)',
                        color: active ? '#4ade80' : '#dc3545',
                        border: `1px solid ${active ? 'rgba(74,222,128,0.3)' : 'rgba(220,53,69,0.3)'}`
                      }}>
                        {active ? '● Active' : '○ Inactive'}
                      </span>
                    </td>

                    {/* Change role */}
                    <td style={styles.td}>
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={styles.select}
                      >
                        <option value="STAFF">STAFF</option>
                        <option value="OFFICER">OFFICER</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={styles.td}>
                      {active ? (
                        <button
                          onClick={() => handleDeactivate(u.id)}
                          style={styles.btnDeactivate}
                          disabled={u.username === currentUser}
                          title={u.username === currentUser ? 'Cannot deactivate yourself' : ''}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <span style={{ color: '#444', fontSize: '12px', fontFamily: 'monospace' }}>
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && !error && (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
              No users found. Register a user first.
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const styles = {
  page:        { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  ucBadge:     { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title:       { color: 'white', fontSize: '32px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle:    { color: '#666', fontSize: '13px', margin: 0 },
  btnPrimary:  { padding: '10px 20px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  btnSecondary:{ padding: '10px 20px', backgroundColor: '#ffffff08', color: '#94a3b8', border: '1px solid #ffffff20', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  statsRow:    { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard:    { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  errorMsg:    { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '16px' },
  loading:     { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '60px', color: '#666' },
  spinner:     { width: '20px', height: '20px', border: '2px solid #333', borderTop: '2px solid #e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  tableWrapper:{ backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { padding: '16px 20px', borderBottom: '1px solid #ffffff10', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  table:       { width: '100%', borderCollapse: 'collapse' },
  thead:       { backgroundColor: '#ffffff05' },
  th:          { padding: '12px 16px', textAlign: 'left', fontSize: '10px', letterSpacing: '1.5px', color: '#444', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td:          { padding: '14px 16px', fontSize: '13px', color: '#999', borderBottom: '1px solid #ffffff08' },
  select:      { backgroundColor: '#ffffff08', border: '1px solid #ffffff15', color: 'white', borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', fontFamily: 'monospace', outline: 'none' },
  btnDeactivate:{ padding: '6px 14px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 },
  empty:       { textAlign: 'center', padding: '60px', color: '#666' },
};

export default UsersPage;
