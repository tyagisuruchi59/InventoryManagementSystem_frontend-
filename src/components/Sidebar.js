// StockPro Inventory Management System
// Component: Sidebar
// Developer: Suru | April 2026

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/uc1/users',           label: 'Users',           icon: '👥', desc: 'View & manage users',  uc: 'UC1 · AUTH SERVICE' },
  { path: '/uc1/register',        label: 'Register User',   icon: '➕', desc: 'Add new user',          uc: '' },
  { path: '/uc2/products',        label: 'Products',        icon: '📦', desc: 'Product catalogue',    uc: 'UC2 · PRODUCT SERVICE' },
  { path: '/uc2/add-product',     label: 'Add Product',     icon: '➕', desc: 'Create new product',   uc: '' },
  { path: '/uc3/warehouses',      label: 'Warehouses',      icon: '🏭', desc: 'Manage warehouses',    uc: 'UC3 · WAREHOUSE SERVICE' },
  { path: '/uc3/stock',           label: 'Stock Levels',    icon: '📦', desc: 'View stock levels',    uc: '' },
  { path: '/uc3/transfer',        label: 'Transfer',        icon: '⇄',  desc: 'Transfer stock',       uc: '' },
  { path: '/uc4/purchase',        label: 'Purchase Orders', icon: '📋', desc: 'Manage PO lifecycle',  uc: 'UC4 · PURCHASE SERVICE' },
  { path: '/uc4/create-po',       label: 'Create PO',       icon: '➕', desc: 'New purchase order',   uc: '' },
  { path: '/uc5/suppliers',       label: 'Suppliers',       icon: '🏢', desc: 'Manage vendors',       uc: 'UC5 · SUPPLIER SERVICE' },
  { path: '/uc5/add-supplier',    label: 'Add Supplier',    icon: '➕', desc: 'Register new vendor',  uc: '' },
  { path: '/uc6/movements',       label: 'Movements',       icon: '📊', desc: 'Stock audit trail',    uc: 'UC6 · MOVEMENT SERVICE' },
  { path: '/uc6/record-movement', label: 'Record Movement', icon: '➕', desc: 'Log new movement',     uc: '' },
  { path: '/uc7/alerts',          label: 'Alerts',          icon: '🔔', desc: 'View all alerts',      uc: 'UC7 · ALERT SERVICE' },
  { path: '/uc7/send-alert',      label: 'Send Alert',      icon: '📢', desc: 'Send notification',    uc: '' },
  { path: '/uc8/reports',         label: 'Reports',         icon: '📊', desc: 'Analytics dashboard',  uc: 'UC8 · REPORT SERVICE' },
];

function Sidebar() {
  const loc      = useLocation();
  const navigate = useNavigate();

  const username = localStorage.getItem('stockpro_username') || 'User';
  const role     = localStorage.getItem('stockpro_role')     || 'STAFF';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside style={{
      width: '240px', minWidth: '240px',
      height: '100vh', position: 'sticky', top: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '12px',
        flexShrink: 0
      }}>
        <span style={{ fontSize: '26px', color: 'var(--accent)' }}>⬡</span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, letterSpacing: '2px' }}>StockPro</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>v1.0 · 2026</div>
        </div>
      </div>

      {/* Nav — scrollable */}
      <nav style={{
        padding: '8px 12px',
        display: 'flex', flexDirection: 'column', gap: '2px',
        flex: 1,
        overflowY: 'auto',
        // Custom scrollbar
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--border) transparent',
      }}>
        {navItems.map(item => {
          const active = loc.pathname === item.path;
          return (
            <React.Fragment key={item.path}>
              {/* UC Section Label */}
              {item.uc && (
                <div style={{
                  padding: '12px 4px 4px',
                  fontFamily: 'var(--font-mono)', fontSize: '9px',
                  color: 'var(--text-muted)', letterSpacing: '1.5px'
                }}>
                  {item.uc}
                </div>
              )}

              <Link to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '8px',
                textDecoration: 'none',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-dim)' : 'transparent',
                border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
                fontSize: '13px', fontWeight: 500,
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '15px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div>{item.label}</div>
                  {item.desc && (
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {item.desc}
                    </div>
                  )}
                </div>
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      {/* User + Logout — always visible at bottom */}
      <div style={{
        padding: '14px 12px',
        borderTop: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: '10px',
        flexShrink: 0,
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'var(--accent)', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '16px',
            fontWeight: 700, flexShrink: 0, color: 'white'
          }}>
            {username[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{username}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px' }}>{role}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '9px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: '6px', color: 'var(--text-muted)',
            fontSize: '12px', cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#e53935';
            e.currentTarget.style.color = '#e53935';
            e.currentTarget.style.background = 'rgba(229,57,53,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ⏻ LOGOUT
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;