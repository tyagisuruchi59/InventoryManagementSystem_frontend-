// StockPro Inventory Management System
// UC1 - Auth Service | Page: Register
// Developer: Suru | April 2026
// Description: Register → POST /api/auth/register

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../api';

function RegisterPage({ embedded }) {
  const [form, setForm]       = useState({ username: '', password: '', role: 'STAFF' });
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError(''); setMessage('');
    setLoading(true);
    try {
      // UC1 — POST /api/auth/register
      await authAPI.post('/api/auth/register', form);
      setMessage('User registered successfully!');
      setForm({ username: '', password: '', role: 'STAFF' });
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
    setLoading(false);
  };

  const formContent = (
    <>
      {/* UC badge */}
      <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', padding: '4px 10px', borderRadius: '4px', marginBottom: '16px' }}>
        UC1 · AUTH SERVICE
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '6px' }}>
        {embedded ? 'Register New User' : 'Create Account'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        POST /api/auth/register
      </p>

      {error   && <div className="msg-error">{error}</div>}
      {message && <div className="msg-success">{message}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input name="username" type="text" placeholder="Enter username"
            value={form.username} onChange={handleChange}
            className="sp-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input name="password" type="password" placeholder="Enter password"
            value={form.password} onChange={handleChange}
            className="sp-input" required />
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="sp-select">
            <option value="STAFF">STAFF — Warehouse Staff</option>
            <option value="MANAGER">MANAGER — Inventory Manager</option>
            <option value="OFFICER">OFFICER — Purchase Officer</option>
            <option value="ADMIN">ADMIN — Administrator</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}
          style={{ padding: '13px', fontSize: '15px', letterSpacing: '1px', marginTop: '4px' }}>
          {loading ? 'Registering...' : 'Register User →'}
        </button>
      </form>

      {!embedded && (
        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
        </div>
      )}
    </>
  );

  // Inside sidebar layout (embedded)
  if (embedded) {
    return (
      <div>
        <div className="page-header">
          <div>
            <div className="uc-label">UC1 · AUTH SERVICE</div>
            <h1 className="page-title">Register <span>New User</span></h1>
          </div>
        </div>
        <div className="sp-card" style={{ maxWidth: '480px' }}>
          {formContent}
        </div>
      </div>
    );
  }

  // Full page (public register)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '60px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, letterSpacing: '2px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--accent)' }}>⬡</span> StockPro
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 700, lineHeight: 1.2 }}>
            Create<br /><span style={{ color: 'var(--accent)' }}>New Account</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1.5px', marginTop: '14px' }}>
            UC1 · AUTH SERVICE · BCrypt + JWT
          </p>
        </div>
      </div>
      <div style={{ width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>{formContent}</div>
      </div>
    </div>
  );
}

export default RegisterPage;