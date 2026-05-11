// StockPro - Advanced Dashboard with Charts
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('stockpro_username') || 'Admin';
  const role = localStorage.getItem('stockpro_role') || 'ADMIN';
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const metrics = [
    { label: 'Total Inventory Value', value: '₹18.4L', change: '+12.5%', trend: 'up', icon: '💰', color: '#10b981', path: '/uc8/reports' },
    { label: 'Products in Stock', value: '1,284', change: '+8', trend: 'up', icon: '📦', color: '#e94560', path: '/uc2/products' },
    { label: 'Active Warehouses', value: '5', change: '0', trend: 'steady', icon: '🏭', color: '#3b82f6', path: '/uc3/warehouses' },
    { label: 'Pending Orders', value: '12', change: '-3', trend: 'down', icon: '📋', color: '#f59e0b', path: '/uc4/purchase' },
    { label: 'Low Stock Alerts', value: '7', change: '+2', trend: 'up', icon: '⚠️', color: '#ef4444', path: '/uc3/stock' },
    { label: 'Monthly Revenue', value: '₹2.4L', change: '+18.3%', trend: 'up', icon: '📈', color: '#8b5cf6', path: '/uc8/reports' },
  ];

  const recentActivities = [
    { id: 1, type: 'order', action: 'Purchase Order #PO-2401 created', user: 'John Doe', time: '5 min ago', status: 'pending' },
    { id: 2, type: 'stock', action: 'Stock received for Product #101', user: 'Warehouse Team', time: '1 hour ago', status: 'completed' },
    { id: 3, type: 'alert', action: 'Low stock alert for Wireless Mouse', user: 'System', time: '2 hours ago', status: 'critical' },
    { id: 4, type: 'transfer', action: 'Stock transfer from Mumbai to Delhi', user: 'Admin', time: '3 hours ago', status: 'completed' },
    { id: 5, type: 'user', action: 'New user registered: Sarah Johnson', user: 'Auth System', time: '5 hours ago', status: 'info' },
  ];

  const topProducts = [
    { name: 'Ultrabook X1', sales: 342, revenue: '₹3.04L', trend: '+23%' },
    { name: 'Mechanical Keyboard', sales: 289, revenue: '₹1.24L', trend: '+15%' },
    { name: 'Wireless Mouse', sales: 210, revenue: '₹85K', trend: '+8%' },
    { name: 'USB-C Hub', sales: 156, revenue: '₹62K', trend: '+31%' },
    { name: 'Monitor 27"', sales: 98, revenue: '₹2.35L', trend: '+12%' },
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return '#10b981';
    if (trend === 'down') return '#ef4444';
    return '#f59e0b';
  };

  return (
    <div className="page-enter" style={{ paddingBottom: '40px' }}>
      {/* Hero Section with Time */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge-purple badge" style={{ marginBottom: '12px' }}>
                <span className="status-dot online" style={{ marginRight: '6px' }}></span>
                ALL SYSTEMS OPERATIONAL
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
                Welcome back, <span style={{ color: '#e94560' }}>{username}</span>
              </h1>
              <p style={{ color: '#94a3b8' }}>
                {role} · Microservices Inventory Platform v2.0
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="metric-card card-enter"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => navigate(metric.path)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="metric-icon" style={{ background: `${metric.color}15` }}>
                <span style={{ fontSize: '24px' }}>{metric.icon}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getTrendColor(metric.trend), fontSize: '13px', fontWeight: 600 }}>
                <span>{getTrendIcon(metric.trend)}</span>
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
            <div className="progress-bar" style={{ marginTop: '12px' }}>
              <div className="progress-fill" style={{ width: `${Math.random() * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', marginBottom: '28px' }}>
        {/* Recent Activity Feed */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>📡 Recent Activity</h3>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>View All</button>
          </div>
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  padding: '14px 24px',
                  borderBottom: '1px solid var(--border-light)',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(233, 69, 96, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(233, 69, 96, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activity.type === 'order' && '📋'}
                    {activity.type === 'stock' && '📦'}
                    {activity.type === 'alert' && '⚠️'}
                    {activity.type === 'transfer' && '⇄'}
                    {activity.type === 'user' && '👤'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{activity.action}</div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>👤 {activity.user}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>🕐 {activity.time}</span>
                    </div>
                  </div>
                  <div className={`badge ${activity.status === 'critical' ? 'badge-danger' : activity.status === 'pending' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px' }}>
                    {activity.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>🏆 Top Performing Products</h3>
          {topProducts.map((product, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 500 }}>{product.name}</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{product.revenue}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Sold: {product.sales} units</span>
                <span style={{ fontSize: '12px', color: '#10b981' }}>{product.trend}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(product.sales / 400) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Add Product', icon: '➕', path: '/uc2/add-product', color: '#e94560' },
            { label: 'Create PO', icon: '📋', path: '/uc4/create-po', color: '#f59e0b' },
            { label: 'Transfer Stock', icon: '⇄', path: '/uc3/transfer', color: '#3b82f6' },
            { label: 'Record Movement', icon: '🔄', path: '/uc6/record-movement', color: '#10b981' },
            { label: 'Send Alert', icon: '🔔', path: '/uc7/send-alert', color: '#8b5cf6' },
            { label: 'View Reports', icon: '📈', path: '/uc8/reports', color: '#ec4899' },
          ].map((action) => (
            <button
              key={action.label}
              className="btn-glass"
              onClick={() => navigate(action.path)}
              style={{
                background: `${action.color}10`,
                borderColor: `${action.color}30`,
                color: action.color,
                padding: '12px'
              }}
            >
              <span>{action.icon}</span> {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
        {[
          { label: 'Uptime (30d)', value: '99.95%', icon: '🟢' },
          { label: 'API Calls Today', value: '2,847', icon: '📡' },
          { label: 'Active Sessions', value: '23', icon: '👥' },
          { label: 'Response Time', value: '124ms', icon: '⚡' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{stat.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;