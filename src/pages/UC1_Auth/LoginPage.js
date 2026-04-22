// StockPro Inventory Management System
// UC1 - Auth Service | Page: Login
// Developer: Suru | April 2026
// Description: Login → POST /api/auth/login → saves token, username, role

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../api';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // UC1 — POST /api/auth/login
      const res = await authAPI.post('/api/auth/login', form);
      const { token, username, role } = res.data;

      // Save to localStorage — used by all other pages
      localStorage.setItem('stockpro_token',    token);
      localStorage.setItem('stockpro_username', username);
      localStorage.setItem('stockpro_role',     role);

      navigate('/uc1/users');
    } catch {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  // Styles
  const page   = { display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' };
  const left   = { flex: 1, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' };
  const right  = { width: '480px', minWidth: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' };
  const card   = { width: '100%', maxWidth: '380px' };

  return (
    <div style={page}>
      {/* Left panel */}
      <div style={left}>
        {/* Glow */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,69,96,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, letterSpacing: '2px' }}>
          <span style={{ color: 'var(--accent)', fontSize: '26px' }}>⬡</span> StockPro
        </div>

        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 700, lineHeight: 1.2, marginBottom: '14px' }}>
            Track. Control.<br /><span style={{ color: 'var(--accent)' }}>Optimise. Grow.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1.5px' }}>
            INVENTORY MANAGEMENT SYSTEM · v1.0 · .NET EDITION
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['Multi-warehouse stock management', 'Real-time alerts & notifications', 'Role-based access control (RBAC)', 'Purchase order lifecycle tracking'].map(f => (
            <div key={f} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: 'var(--accent)' }}>◈</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div style={right}>
        <div style={card}>
          {/* UC badge */}
          <div style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', padding: '4px 10px', borderRadius: '4px', marginBottom: '16px' }}>
            UC1 · AUTH SERVICE
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>Sign In</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>Enter your credentials to access StockPro</p>

          {error && <div className="msg-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input name="username" type="text" placeholder="Enter username"
                value={form.username} onChange={handleChange}
                className="sp-input" required autoComplete="username" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" placeholder="Enter password"
                value={form.password} onChange={handleChange}
                className="sp-input" required autoComplete="current-password" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ padding: '13px', fontSize: '15px', letterSpacing: '1px', marginTop: '6px' }}>
              {loading ? 'Signing in...' : 'Sign In  →'}
            </button>
          </form>

          
          {/* Role hint for evaluator/teacher */}
          <div style={{ marginTop: '28px', padding: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
              Available Roles
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['ADMIN', 'MANAGER', 'OFFICER', 'STAFF'].map(r => (
                <span key={r} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', padding: '3px 8px', borderRadius: '4px' }}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;