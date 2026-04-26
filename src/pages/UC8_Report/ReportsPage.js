// StockPro Inventory Management System
// UC8 - Report Service | Page: Reports & Analytics
// Developer: Suru | April 2026
// Description: Business intelligence dashboard connected to Report Service

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const reportAPI = axios.create({ baseURL: 'http://localhost:5008' });
reportAPI.interceptors.request.use(config => {
  const token = localStorage.getItem('stockpro_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function ReportsPage() {
  const [stockValue, setStockValue] = useState(0);
  const [lowStock, setLowStock]     = useState([]);
  const [fullReport, setFullReport] = useState(null);
  const [topMoving, setTopMoving]   = useState([]);
  const [deadStock, setDeadStock]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('overview');

  useEffect(() => { fetchAllReports(); }, []);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const [totalRes, lowRes, fullRes, topRes, deadRes] = await Promise.allSettled([
        reportAPI.get('/api/report/totalvalue'),
        reportAPI.get('/api/report/lowstock'),
        reportAPI.get('/api/report/generate'),
        reportAPI.get('/api/report/topmoving'),
        reportAPI.get('/api/report/deadstock'),
      ]);

      if (totalRes.status === 'fulfilled') {
        const data = totalRes.value.data;
        // Handle both { totalStockValue: 0 } and plain number
        setStockValue(data?.totalStockValue ?? data ?? 0);
      }
      if (lowRes.status === 'fulfilled') {
        setLowStock(lowRes.value.data?.data || []);
      }
      if (fullRes.status === 'fulfilled') {
        setFullReport(fullRes.value.data?.data || null);
      }
      if (topRes.status === 'fulfilled') {
        setTopMoving(topRes.value.data?.data || []);
      }
      if (deadRes.status === 'fulfilled') {
        setDeadStock(deadRes.value.data?.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['overview', 'low stock', 'top moving', 'dead stock', 'snapshots'];

  return (
    <div style={{ padding: '2rem', color: '#e0e0e0', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{
            fontSize: '11px', color: '#e53935', letterSpacing: '2px',
            marginBottom: '4px', fontFamily: 'monospace',
            background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)',
            display: 'inline-block', padding: '3px 10px', borderRadius: '4px'
          }}>
            UC8 · REPORT SERVICE
          </div>
          <h1 style={{ margin: '8px 0 4px', fontSize: '2rem', color: '#fff', fontWeight: 800 }}>
            Reports & Analytics
          </h1>
          <p style={{ color: '#888', margin: 0 }}>Business intelligence across all microservices</p>
        </div>
        <button onClick={fetchAllReports} style={{
          background: '#e53935', color: '#fff', padding: '10px 20px',
          borderRadius: '8px', border: 'none', cursor: 'pointer',
          fontWeight: '600', fontSize: '14px'
        }}>↻ Refresh</button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Stock Value', value: `₹${Number(stockValue).toLocaleString()}`, color: '#4caf50' },
          { label: 'Low Stock Items',   value: lowStock.length, color: '#e53935' },
          { label: 'Total Snapshots',   value: fullReport?.totalSnapshots ?? 0, color: '#2196f3' },
          { label: 'Report Date',       value: new Date().toLocaleDateString(), color: '#ff9800' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#1e2a3a', borderRadius: '12px', padding: '1.4rem',
            borderLeft: `4px solid ${card.color}`
          }}>
            <div style={{ fontSize: '10px', color: '#888', marginBottom: '8px', letterSpacing: '1.5px', fontFamily: 'monospace' }}>
              {card.label.toUpperCase()}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 18px', borderRadius: '20px', border: 'none',
            textTransform: 'capitalize',
            background: activeTab === tab ? '#e53935' : '#1e2a3a',
            color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '13px'
          }}>{tab}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          Loading reports...
        </div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ background: '#1e2a3a', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ color: '#fff', marginTop: 0, fontFamily: 'monospace', letterSpacing: '1px' }}>
                INVENTORY SUMMARY
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Total Stock Value',  value: `₹${Number(stockValue).toLocaleString()}`, color: '#4caf50' },
                  { label: 'Total Snapshots',    value: fullReport?.totalSnapshots ?? 0, color: '#2196f3' },
                  { label: 'Low Stock Count',    value: lowStock.length, color: '#e53935' },
                  { label: 'Stock Value by WH',  value: fullReport?.stockValueByWarehouse ? Object.keys(fullReport.stockValueByWarehouse).length + ' warehouses' : '0 warehouses', color: '#ff9800' },
                  { label: 'Top Moving Products', value: topMoving.length, color: '#9c27b0' },
                  { label: 'Dead Stock Items',   value: deadStock.length, color: '#607d8b' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: '#151e2b', borderRadius: '8px', padding: '1.2rem',
                    borderTop: `3px solid ${item.color}`
                  }}>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '8px', letterSpacing: '1px', fontFamily: 'monospace' }}>
                      {item.label.toUpperCase()}
                    </div>
                    <div style={{ color: item.color, fontSize: '1.4rem', fontWeight: '700' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOW STOCK TAB */}
          {activeTab === 'low stock' && (
            <div style={{ background: '#1e2a3a', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #2a3a4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>Low Stock Items</h3>
                <span style={{ background: 'rgba(229,57,53,0.1)', color: '#e53935', border: '1px solid rgba(229,57,53,0.3)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                  {lowStock.length} items
                </span>
              </div>
              {lowStock.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#4caf50' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                  All products are well stocked!<br />
                  <span style={{ color: '#666', fontSize: '13px' }}>Add snapshots via Report Service Swagger to see data here.</span>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#151e2b' }}>
                      {['Product ID', 'Warehouse', 'Quantity', 'Stock Value', 'Status'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#888', fontSize: '11px', letterSpacing: '1px', fontFamily: 'monospace' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #2a3a4a' }}>
                        <td style={{ padding: '12px 16px', color: '#e0e0e0', fontFamily: 'monospace' }}>#{item.productId}</td>
                        <td style={{ padding: '12px 16px', color: '#e0e0e0' }}>WH #{item.warehouseId}</td>
                        <td style={{ padding: '12px 16px', color: '#e53935', fontWeight: '700', fontSize: '1.1rem' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 16px', color: '#4caf50' }}>₹{item.stockValue}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: 'rgba(229,57,53,0.15)', color: '#e53935', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(229,57,53,0.3)' }}>
                            ⚠ LOW STOCK
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TOP MOVING TAB */}
          {activeTab === 'top moving' && (
            <div style={{ background: '#1e2a3a', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #2a3a4a' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>Top Moving Products</h3>
              </div>
              {topMoving.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
                  No data yet. Add inventory snapshots first.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#151e2b' }}>
                      {['Rank', 'Product ID', 'Total Quantity', 'Total Value'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#888', fontSize: '11px', letterSpacing: '1px', fontFamily: 'monospace' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {topMoving.map((item, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #2a3a4a' }}>
                        <td style={{ padding: '12px 16px', color: '#ff9800', fontWeight: 700 }}>#{i + 1}</td>
                        <td style={{ padding: '12px 16px', color: '#e0e0e0', fontFamily: 'monospace' }}>#{item.productId}</td>
                        <td style={{ padding: '12px 16px', color: '#2196f3', fontWeight: 600 }}>{item.totalQuantity}</td>
                        <td style={{ padding: '12px 16px', color: '#4caf50' }}>₹{item.totalValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* DEAD STOCK TAB */}
          {activeTab === 'dead stock' && (
            <div style={{ background: '#1e2a3a', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #2a3a4a' }}>
                <h3 style={{ color: '#fff', margin: 0 }}>Dead Stock (No movement 90+ days)</h3>
              </div>
              {deadStock.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#4caf50' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                  No dead stock found!
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#151e2b' }}>
                      {['Product ID', 'Last Seen', 'Stock Value'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#888', fontSize: '11px', letterSpacing: '1px', fontFamily: 'monospace' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deadStock.map((item, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #2a3a4a' }}>
                        <td style={{ padding: '12px 16px', color: '#e0e0e0', fontFamily: 'monospace' }}>#{item.productId}</td>
                        <td style={{ padding: '12px 16px', color: '#888' }}>{new Date(item.lastSeen).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px', color: '#607d8b' }}>₹{item.stockValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* SNAPSHOTS TAB */}
          {activeTab === 'snapshots' && (
            <div style={{ background: '#1e2a3a', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ color: '#fff', marginTop: 0 }}>How to Populate Report Data</h3>
              <div style={{ color: '#888', lineHeight: '2' }}>
                <p style={{ color: '#ccc' }}>Reports are based on <strong style={{ color: '#fff' }}>inventory snapshots</strong> taken by the background service daily.</p>
                <p>To add data manually:</p>
                <ol style={{ paddingLeft: '20px' }}>
                  <li>Open <a href="http://localhost:5008/swagger" target="_blank" rel="noreferrer" style={{ color: '#e53935' }}>Report Service Swagger (port 5008)</a></li>
                  <li>Authorize with your Bearer token</li>
                  <li>Call <code style={{ background: '#151e2b', padding: '2px 6px', borderRadius: '4px', color: '#4caf50' }}>POST /api/report/snapshot</code></li>
                  <li>Enter warehouseId, productId, quantity, costPrice</li>
                  <li>Come back and click Refresh</li>
                </ol>
                <div style={{ background: '#151e2b', borderRadius: '8px', padding: '1rem', marginTop: '1rem', fontFamily: 'monospace', fontSize: '13px' }}>
                  <div style={{ color: '#888', marginBottom: '8px' }}>Example snapshot payload:</div>
                  <div style={{ color: '#4caf50' }}>{`{`}</div>
                  <div style={{ color: '#ccc', paddingLeft: '16px' }}>"warehouseId": 1,</div>
                  <div style={{ color: '#ccc', paddingLeft: '16px' }}>"productId": 1,</div>
                  <div style={{ color: '#ccc', paddingLeft: '16px' }}>"quantity": 50,</div>
                  <div style={{ color: '#ccc', paddingLeft: '16px' }}>"costPrice": 999.99</div>
                  <div style={{ color: '#4caf50' }}>{`}`}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}