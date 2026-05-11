// StockPro Inventory Management System
// UC1 - Auth Service | Page: Login
// Developer: Suru | April 2026
// Description: Login → POST /api/auth/login → saves token, username, role

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on load
    setTimeout(() => setAnimate(true), 100);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.post('/api/auth/login', form);
      const { token, username, role } = res.data;
      localStorage.setItem('stockpro_token', token);
      localStorage.setItem('stockpro_username', username);
      localStorage.setItem('stockpro_role', role);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password. Please try again.');
    }
    setLoading(false);
  };

  const stats = [
    { value: '8', label: 'Microservices' },
    { value: '4', label: 'User Roles' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '15m', label: 'Alert Cycle' },
  ];

  const features = [
    { icon: '🏭', text: 'Multi-warehouse stock management' },
    { icon: '🔔', text: 'Real-time alerts & notifications' },
    { icon: '🔐', text: 'Role-based access control (RBAC)' },
    { icon: '📋', text: 'Purchase order lifecycle tracking' },
    { icon: '📊', text: 'Inventory analytics & reporting' },
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0d0d1a',
      fontFamily: "'Segoe UI', sans-serif",
      overflow: 'hidden'
    }}>
      {/* Animated background dots */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundImage: 'radial-gradient(circle, #ffffff08 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* LEFT PANEL */}
      <div style={{
        flex: 1, maxWidth: '55%',
        backgroundColor: '#0f0f23',
        borderRight: '1px solid #ffffff15',
        padding: '50px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateX(0)' : 'translateX(-30px)',
        transition: 'all 0.8s ease'
      }}>
        {/* Glow effects */}
        <div style={{
          position: 'absolute', top: '-150px', left: '-150px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,69,96,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', color: 'white'
        }}>
          <div style={{
            width: '40px', height: '40px',
            backgroundColor: '#e94560',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px'
          }}>⬡</div>
          <span style={{
            fontSize: '22px', fontWeight: 700,
            letterSpacing: '2px', color: 'white'
          }}>StockPro</span>
        </div>

        {/* Hero text */}
        <div>
          <h1 style={{
            color: 'white', fontSize: '48px',
            fontWeight: 800, lineHeight: 1.2,
            marginBottom: '16px'
          }}>
            Track. Control.<br />
            <span style={{ color: '#e94560' }}>Optimise. Grow.</span>
          </h1>
          <p style={{
            color: '#666', fontSize: '11px',
            letterSpacing: '2px', fontFamily: 'monospace',
            marginBottom: '40px'
          }}>
            INVENTORY MANAGEMENT SYSTEM · v1.0 · .NET EDITION
          </p>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px', marginBottom: '40px'
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                backgroundColor: '#ffffff08',
                border: '1px solid #ffffff10',
                borderRadius: '10px', padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{
                  color: '#e94560', fontSize: '24px',
                  fontWeight: 800, marginBottom: '4px'
                }}>{s.value}</div>
                <div style={{
                  color: '#666', fontSize: '11px',
                  letterSpacing: '1px'
                }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                gap: '10px', color: '#999', fontSize: '13px'
              }}>
                <span style={{
                  fontSize: '16px',
                  backgroundColor: '#ffffff08',
                  padding: '6px', borderRadius: '6px'
                }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div style={{
          color: '#333', fontSize: '11px',
          fontFamily: 'monospace', letterSpacing: '1px'
        }}>
          © 2026 StockPro · Capgemini Training Project · ASP.NET Core 8 Microservices
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        zIndex: 1,
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateX(0)' : 'translateX(30px)',
        transition: 'all 0.8s ease 0.2s'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* UC Badge */}
          <div style={{
            display: 'inline-block',
            fontFamily: 'monospace', fontSize: '10px',
            letterSpacing: '2px', color: '#e94560',
            backgroundColor: 'rgba(233,69,96,0.1)',
            border: '1px solid rgba(233,69,96,0.3)',
            padding: '5px 12px', borderRadius: '4px',
            marginBottom: '20px'
          }}>
            UC1 · AUTH SERVICE
          </div>

          <h2 style={{
            color: 'white', fontSize: '32px',
            fontWeight: 700, marginBottom: '8px'
          }}>Sign In</h2>
          <p style={{
            color: '#666', fontSize: '14px',
            marginBottom: '32px'
          }}>Enter your credentials to access StockPro</p>

          {/* Error message */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(220,53,69,0.1)',
              border: '1px solid rgba(220,53,69,0.3)',
              color: '#dc3545', padding: '12px 16px',
              borderRadius: '8px', fontSize: '13px',
              marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{
            display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div>
              <label style={{
                color: '#999', fontSize: '11px',
                letterSpacing: '1.5px', display: 'block',
                marginBottom: '8px', fontFamily: 'monospace'
              }}>USERNAME</label>
              <input
              name="username" type="text"
              autoComplete="off"
              placeholder="Enter your username"
              value={form.username} onChange={handleChange}
             required
                style={{
                  width: '100%', padding: '14px 16px',
                  backgroundColor: '#ffffff08',
                  border: '1px solid #ffffff15',
                  borderRadius: '8px', color: 'white',
                  fontSize: '15px', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border 0.3s'
                }}
                onFocus={e => e.target.style.border = '1px solid #e94560'}
                onBlur={e => e.target.style.border = '1px solid #ffffff15'}
              />
            </div>

            <div>
              <label style={{
                color: '#999', fontSize: '11px',
                letterSpacing: '1.5px', display: 'block',
                marginBottom: '8px', fontFamily: 'monospace'
              }}>PASSWORD</label>
              <input
                name="password" type="password"
                placeholder="Enter your password"
                value={form.password} onChange={handleChange}
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  backgroundColor: '#ffffff08',
                  border: '1px solid #ffffff15',
                  borderRadius: '8px', color: 'white',
                  fontSize: '15px', outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.border = '1px solid #e94560'}
                onBlur={e => e.target.style.border = '1px solid #ffffff15'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                padding: '14px',
                backgroundColor: loading ? '#666' : '#e94560',
                color: 'white', border: 'none',
                borderRadius: '8px', fontSize: '15px',
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '1px',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px'
              }}
              onMouseOver={e => { if (!loading) e.target.style.backgroundColor = '#c73652' }}
              onMouseOut={e => { if (!loading) e.target.style.backgroundColor = '#e94560' }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: '16px', height: '16px',
                    border: '2px solid #ffffff40',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing in...
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Roles hint */}
          <div style={{
            marginTop: '30px',
            backgroundColor: '#ffffff05',
            border: '1px solid #ffffff10',
            borderRadius: '10px', padding: '16px'
          }}>
            <div style={{
              color: '#444', fontSize: '10px',
              letterSpacing: '2px', fontFamily: 'monospace',
              marginBottom: '12px'
            }}>AVAILABLE ROLES</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['ADMIN', 'MANAGER', 'OFFICER', 'STAFF'].map(r => (
                <span key={r} style={{
                  fontFamily: 'monospace', fontSize: '11px',
                  color: '#e94560',
                  backgroundColor: 'rgba(233,69,96,0.1)',
                  border: '1px solid rgba(233,69,96,0.2)',
                  padding: '4px 10px', borderRadius: '4px',
                  letterSpacing: '1px'
                }}>{r}</span>
              ))}
            </div>
          </div>

          {/* Register link */}
          <p style={{
            color: '#444', fontSize: '13px',
            textAlign: 'center', marginTop: '24px'
          }}>
            New user?{' '}
            <a href="/register" style={{
              color: '#e94560',
              textDecoration: 'none', fontWeight: 600
            }}>Register here</a>
          </p>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #444; }
      `}</style>
    </div>
  );
}

export default LoginPage;
