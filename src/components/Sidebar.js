// StockPro - Premium Sidebar with Dashboard & Theme Toggle
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('stockpro_username') || 'Admin';
  const role = localStorage.getItem('stockpro_role') || 'ADMIN';
  const [isDark, setIsDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('stockpro_theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('stockpro_theme', newTheme ? 'dark' : 'light');
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navSections = [
    {
      title: 'MAIN',
      icon: '🏠',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Analytics & Insights' }
      ]
    },
    {
      title: 'AUTH SERVICE',
      icon: '🔐',
      items: [
        { path: '/uc1/users', label: 'User Management', icon: '👥', description: 'Manage users & roles' },
        { path: '/uc1/register', label: 'Register User', icon: '➕', description: 'Add new user' }
      ]
    },
    {
      title: 'PRODUCT SERVICE',
      icon: '📦',
      items: [
        { path: '/uc2/products', label: 'Products', icon: '📦', description: 'Product catalogue' },
        { path: '/uc2/add-product', label: 'Add Product', icon: '✨', description: 'Create new product' }
      ]
    },
    {
      title: 'WAREHOUSE SERVICE',
      icon: '🏭',
      items: [
        { path: '/uc3/warehouses', label: 'Warehouses', icon: '🏭', description: 'Manage locations' },
        { path: '/uc3/stock', label: 'Stock Levels', icon: '📊', description: 'Inventory status' },
        { path: '/uc3/transfer', label: 'Transfer Stock', icon: '🔄', description: 'Move inventory' }
      ]
    },
    {
      title: 'PURCHASE SERVICE',
      icon: '📋',
      items: [
        { path: '/uc4/purchase', label: 'Purchase Orders', icon: '📋', description: 'Manage POs' },
        { path: '/uc4/create-po', label: 'Create PO', icon: '➕', description: 'New purchase order' }
      ]
    },
    {
      title: 'SUPPLIER SERVICE',
      icon: '🏢',
      items: [
        { path: '/uc5/suppliers', label: 'Suppliers', icon: '🏢', description: 'Vendor management' },
        { path: '/uc5/add-supplier', label: 'Add Supplier', icon: '✨', description: 'Register vendor' }
      ]
    },
    {
      title: 'MOVEMENT SERVICE',
      icon: '🔄',
      items: [
        { path: '/uc6/movements', label: 'Movements', icon: '📜', description: 'Audit trail' },
        { path: '/uc6/record-movement', label: 'Record Movement', icon: '✍️', description: 'Log movement' }
      ]
    },
    {
      title: 'ALERT SERVICE',
      icon: '🔔',
      items: [
        { path: '/uc7/alerts', label: 'Alerts', icon: '🔔', description: 'System notifications' },
      ]
    },
    {
      title: 'REPORT SERVICE',
      icon: '📈',
      items: [
        { path: '/uc8/reports', label: 'Analytics', icon: '📈', description: 'Business intelligence' }
      ]
    }
  ];

  return (
    <>
      <style jsx>{`
        .sidebar {
          width: ${collapsed ? '72px' : '300px'};
          min-width: ${collapsed ? '72px' : '300px'};
          background: var(--bg-secondary);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          z-index: 100;
          flex-shrink: 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed ? '12px' : '10px 14px'};
          border-radius: 12px;
          margin: 2px 0;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
          color: var(--text-primary, #e2e8f0);
        }

        .nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--accent-primary);
          transform: scaleY(0);
          transition: transform 0.2s;
        }

        .nav-item.active::before {
          transform: scaleY(1);
        }

        .nav-item.active {
          background: linear-gradient(95deg, rgba(233, 69, 96, 0.12) 0%, rgba(233, 69, 96, 0.02) 100%);
          color: var(--accent-primary);
        }

        .nav-item:not(.active):hover {
          background: rgba(233, 69, 96, 0.08);
          transform: translateX(${collapsed ? '0' : '4px'});
        }

        .nav-icon {
          font-size: 18px;
          width: 28px;
          min-width: 28px;
          text-align: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.1);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0 6px ${collapsed ? '0' : '8px'};
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted, #5a6583);
          letter-spacing: 1.2px;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
        }

        .sidebar-logo {
          padding: 20px ${collapsed ? '12px' : '20px'};
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          justify-content: ${collapsed ? 'center' : 'flex-start'};
        }

        .sidebar-logo:hover .logo-icon {
          transform: rotate(10deg) scale(1.05);
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          background: linear-gradient(135deg, #e94560 0%, #c72c48 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 2px 8px rgba(233, 69, 96, 0.2);
          transition: all 0.2s;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--text-primary, #e2e8f0);
        }

        .logo-badge {
          font-size: 9px;
          color: var(--text-muted, #5a6583);
          font-family: monospace;
          margin-top: 2px;
        }

        .user-section {
          margin-top: auto;
          border-top: 1px solid var(--border-light);
          padding: ${collapsed ? '12px 8px' : '16px'};
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: linear-gradient(135deg, #e94560 0%, #c72c48 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          color: white;
          transition: transform 0.2s;
        }

        .user-avatar:hover {
          transform: scale(1.05);
        }

        .theme-toggle-btn {
          width: 100%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 12px;
          color: var(--text-primary, #e2e8f0);
          font-size: 13px;
          font-weight: 500;
        }

        .theme-toggle-btn:hover {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .collapse-btn {
          position: absolute;
          right: -13px;
          top: 76px;
          width: 26px;
          height: 26px;
          background: var(--accent-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
          font-size: 11px;
          color: white;
          box-shadow: 0 2px 8px rgba(233, 69, 96, 0.3);
        }

        .collapse-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
        }

        .role-badge {
          background: rgba(233, 69, 96, 0.15);
          border-radius: 20px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 700;
          color: var(--accent-primary);
          display: inline-block;
          letter-spacing: 0.5px;
        }

        .nav-label {
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          color: inherit;
        }

        .nav-desc {
          font-size: 10px;
          color: #94a3b8;
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
        }

        .active-dot {
          width: 6px;
          height: 6px;
          min-width: 6px;
          border-radius: 50%;
          background: #e94560;
          box-shadow: 0 0 8px #e94560;
          margin-left: auto;
        }
      `}</style>

      <aside className="sidebar">
        {/* Collapse Toggle */}
        <div className="collapse-btn" onClick={toggleSidebar}>
          {collapsed ? '→' : '←'}
        </div>

        {/* Logo */}
        <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
          <div className="logo-icon">⬡</div>
          {!collapsed && (
            <div>
              <div className="logo-text">StockPro</div>
              <div className="logo-badge">IMS v2.0</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="section-title">
                <span>{section.icon}</span>
                {!collapsed && <span>{section.title}</span>}
              </div>
              {section.items.map((item, itemIdx) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  style={{ animationDelay: `${itemIdx * 0.02}s` }}
                  title={collapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="nav-label">{item.label}</div>
                      {item.description && (
                        <div className="nav-desc">{item.description}</div>
                      )}
                    </div>
                  )}
                  {isActive(item.path) && !collapsed && (
                    <span className="active-dot" />
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="user-section">
          {/* Theme Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
            {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div className="user-avatar">{username[0]?.toUpperCase()}</div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary, #e2e8f0)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {username}
                </div>
                <div className="role-badge">{role}</div>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '10px',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
          >
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>

          {!collapsed && (
            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '10px', color: '#5a6583' }}>
              v2.0.0 · .NET 8 Microservices
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;