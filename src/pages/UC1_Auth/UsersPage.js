// StockPro Inventory Management System
// UC1 - Auth Service | Page: Users Management
// Developer: Suru | April 2026
// Description: View all users, change role, deactivate

import React, { useState, useEffect } from 'react';
import { authAPI } from '../../api';

function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // UC1 — GET /api/auth/users (Admin only)
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
      // UC1 — PUT /api/auth/users/{id}/deactivate
      await authAPI.put(`/api/auth/users/${id}/deactivate`);
      loadUsers();
    } catch { alert('Failed to deactivate'); }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      // UC1 — PUT /api/auth/users/{id}/role
      await authAPI.put(`/api/auth/users/${id}/role`, { role: newRole });
      loadUsers();
    } catch { alert('Failed to update role'); }
  };

  const roleBadge = (role) => {
    const map = { ADMIN: 'badge-danger', MANAGER: 'badge-warning', OFFICER: 'badge-info', STAFF: 'badge-muted' };
    return map[role] || 'badge-muted';
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="uc-label">UC1 · AUTH SERVICE</div>
          <h1 className="page-title">User <span>Management</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadUsers} className="btn btn-secondary">↻ Refresh</button>
          <a href="/uc1/register" className="btn btn-primary">+ Register User</a>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Users',  value: users.length,                              color: 'var(--info)' },
          { label: 'Active',       value: users.filter(u => u.isActive).length,      color: 'var(--success)' },
          { label: 'Admins',       value: users.filter(u => u.role === 'ADMIN').length, color: 'var(--danger)' },
          { label: 'Staff',        value: users.filter(u => u.role === 'STAFF').length, color: 'var(--warning)' },
        ].map(s => (
          <div key={s.label} className="sp-card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && <div className="msg-error">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading users...</div>
      ) : (
        <div className="sp-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="sp-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Change Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '13px' }}>#{u.id}</td>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td><span className={`badge ${roleBadge(u.role)}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    {/* Change role dropdown */}
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '4px', padding: '5px 8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                    >
                      <option value="STAFF">STAFF</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="OFFICER">OFFICER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    {u.isActive ? (
                      <button onClick={() => handleDeactivate(u.id)} className="btn btn-danger" style={{ padding: '5px 12px', fontSize: '12px' }}>
                        Deactivate
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              No users found. Register a user first.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UsersPage;