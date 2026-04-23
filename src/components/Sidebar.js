// StockPro Inventory Management System
// Component: Sidebar — UC1 only
// Developer: Suru | April 2026

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/uc1/users',    label: 'Users',          icon: '👥', desc: 'View & manage users' },
  { path: '/uc1/register', label: 'Register User',  icon: '➕', desc: 'Add new user'        },
  { path: '/uc2/products', label: 'Products', icon: '📦', uc: 'UC2' },
{ path: '/uc2/add-product', label: 'Add Product', icon: '➕', uc: 'UC2' },
];

function Sidebar() {
  const location = useNavigate();
  const loc      = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem('stockpro_username') || 'User';
  const role     = localStorage.getItem('stockpro_role')     || 'STAFF';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const sidebarStyle = {
    width: '240px', minWidth: '240px',
    height: '100vh', position: 'sticky', top: 0,
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '26px', color: 'var(--accent)' }}>⬡</span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, letterSpacing: '2px' }}>StockPro</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>v1.0 · 2026</div>
        </div>
      </div>

      {/* UC1 label */}
      <div style={{ padding: '16px 20px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '2px' }}>
        UC1 · AUTH SERVICE
      </div>

      {/* Nav */}
      <nav style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map(item => {
          const active = loc.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px',
              textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              background: active ? 'var(--accent-dim)' : 'transparent',
              border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
              fontSize: '13px', fontWeight: 500,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              <div>
                <div>{item.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.desc}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, flexShrink: 0 }}>
            {username[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>{username}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px' }}>{role}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '8px',
          background: 'transparent', border: '1px solid var(--border)',
          borderRadius: '6px', color: 'var(--text-muted)',
          fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-mono)',
          letterSpacing: '1px', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}
        >
          ⏻ LOGOUT
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;