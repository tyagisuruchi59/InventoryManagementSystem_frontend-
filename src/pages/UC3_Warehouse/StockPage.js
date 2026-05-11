// StockPro Inventory Management System
// UC3 - Warehouse Service | Page: Stock Levels
// Developer: Suru | April 2026
// Description: Shows ALL stock levels across all warehouses

import React, { useState, useEffect, useCallback } from 'react';
import { warehouseAPI } from '../../api';

function StockPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [stock, setStock] = useState([]);
  const [allStock, setAllStock] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [showAddStock, setShowAddStock] = useState(false);
  const [stockForm, setStockForm] = useState({ warehouseId: '', productId: '', quantity: '', reservedQuantity: '0', reorderLevel: '', maxStockLevel: '' });

  const loadAllStock = useCallback(async (warehouseList) => {
    try {
      const allResults = await Promise.all(
        warehouseList.map(w => warehouseAPI.get(`/api/warehouse/${w.id}/stock`))
      );
      const combined = allResults.flatMap((res, i) =>
        res.data.map(s => ({ ...s, warehouseName: warehouseList[i].name, warehouseId: warehouseList[i].id }))
      );
      setAllStock(combined);
      setStock(combined);
    } catch (err) { console.log(err); }
  }, []);

  const loadWarehouses = useCallback(async () => {
    try {
      const res = await warehouseAPI.get('/api/warehouse');
      setWarehouses(res.data);
      // Auto load ALL warehouses stock
      loadAllStock(res.data);
    } catch (err) { console.log(err); }
  }, [loadAllStock]);

  const loadLowStock = useCallback(async () => {
    try {
      const res = await warehouseAPI.get('/api/warehouse/stock/lowstock');
      setLowStock(res.data);
    } catch (err) { console.log(err); }
  }, []);

  useEffect(() => {
    loadWarehouses();
    loadLowStock();
  }, [loadWarehouses, loadLowStock]);

  const loadStock = async (warehouseId) => {
    if (!warehouseId) {
      setStock(allStock);
      return;
    }
    try {
      const res = await warehouseAPI.get(`/api/warehouse/${warehouseId}/stock`);
      const wh = warehouses.find(w => w.id === parseInt(warehouseId));
      setStock(res.data.map(s => ({ ...s, warehouseName: wh?.name, warehouseId: parseInt(warehouseId) })));
    } catch (err) { console.log(err); }
  };

  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
    loadStock(e.target.value);
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await warehouseAPI.post('/api/warehouse/stock', {
        warehouseId: parseInt(stockForm.warehouseId),
        productId: parseInt(stockForm.productId),
        quantity: parseInt(stockForm.quantity),
        reservedQuantity: parseInt(stockForm.reservedQuantity),
        reorderLevel: parseInt(stockForm.reorderLevel),
        maxStockLevel: parseInt(stockForm.maxStockLevel),
      });
      alert('Stock updated!');
      setShowAddStock(false);
      loadWarehouses();
    } catch { alert('Error updating stock'); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC3 · STOCK LEVELS</div>
          <h1 style={styles.title}>Stock Level Management</h1>
          <p style={styles.subtitle}>View and manage stock across all warehouses</p>
        </div>
        <button onClick={() => setShowAddStock(!showAddStock)} style={styles.btnPrimary}>
          {showAddStock ? '✕ Cancel' : '+ Add Stock'}
        </button>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div style={{ backgroundColor: 'rgba(255,171,0,0.1)', border: '1px solid rgba(255,171,0,0.3)', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ color: '#ffab00', fontWeight: 600, marginBottom: '8px' }}>⚠️ {lowStock.length} Low Stock Items</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {lowStock.map(s => (
              <span key={s.id} style={{ backgroundColor: 'rgba(255,171,0,0.1)', border: '1px solid rgba(255,171,0,0.3)', color: '#ffab00', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                Product #{s.productId} — {s.quantity} units
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add stock form */}
      {showAddStock && (
        <div style={styles.formCard}>
          <h3 style={{ color: 'white', marginBottom: '20px' }}>Add / Update Stock</h3>
          <form onSubmit={handleAddStock}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
              {[
                { name: 'warehouseId', placeholder: 'Warehouse ID' },
                { name: 'productId', placeholder: 'Product ID' },
                { name: 'quantity', placeholder: 'Quantity' },
                { name: 'reservedQuantity', placeholder: 'Reserved Qty (default 0)' },
                { name: 'reorderLevel', placeholder: 'Reorder Level' },
                { name: 'maxStockLevel', placeholder: 'Max Stock Level' },
              ].map(f => (
                <div key={f.name}>
                  <label style={styles.label}>{f.name.toUpperCase()}</label>
                  <input name={f.name} type="number" placeholder={f.placeholder}
                    value={stockForm[f.name]}
                    onChange={e => setStockForm({ ...stockForm, [e.target.name]: e.target.value })}
                    style={styles.input} required />
                </div>
              ))}
            </div>
            <button type="submit" style={styles.btnPrimary}>Save Stock</button>
          </form>
        </div>
      )}

      {/* Filter dropdown */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ ...styles.label, display: 'block', marginBottom: '8px' }}>FILTER BY WAREHOUSE</label>
        <select value={selectedWarehouse} onChange={handleWarehouseChange}
          style={{ ...styles.input, maxWidth: '400px', cursor: 'pointer', backgroundColor: '#0f0f23', color: 'white' }}>
          <option value="" style={{ backgroundColor: '#0f0f23', color: 'white' }}>-- All Warehouses --</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.id} style={{ backgroundColor: '#0f0f23', color: 'white' }}>[ID:{w.id}] {w.name}</option>
          ))}
        </select>
      </div>

      {/* Stock table — shows ALL by default */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.th}>Warehouse</th>
              <th style={styles.th}>Product ID</th>
              <th style={styles.th}>Total Qty</th>
              <th style={styles.th}>Reserved</th>
              <th style={styles.th}>Available</th>
              <th style={styles.th}>Reorder Level</th>
              <th style={styles.th}>Max Level</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((s, i) => (
              <tr key={s.id} style={{ backgroundColor: i % 2 === 0 ? '#0f0f23' : '#0d0d1a' }}>
                <td style={styles.td}><span style={{ fontFamily: 'monospace', color: '#818cf8' }}>{s.warehouseName || `WH#${s.warehouseId}`}</span></td>
                <td style={styles.td}><span style={{ fontFamily: 'monospace', color: '#e94560' }}>#{s.productId}</span></td>
                <td style={styles.td}>{s.quantity}</td>
                <td style={styles.td}>{s.reservedQuantity}</td>
                <td style={{ ...styles.td, color: '#4ade80', fontWeight: 600 }}>{s.availableQuantity}</td>
                <td style={styles.td}>{s.reorderLevel}</td>
                <td style={styles.td}>{s.maxStockLevel}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
                    backgroundColor: s.quantity < s.reorderLevel ? 'rgba(255,171,0,0.1)' : 'rgba(74,222,128,0.1)',
                    color: s.quantity < s.reorderLevel ? '#ffab00' : '#4ade80',
                    border: `1px solid ${s.quantity < s.reorderLevel ? 'rgba(255,171,0,0.3)' : 'rgba(74,222,128,0.3)'}`
                  }}>
                    {s.quantity < s.reorderLevel ? '⚠️ Low Stock' : '✅ OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {stock.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: '40px' }}>📦</div>
            No stock records found. Add stock using the + Add Stock button.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  ucBadge: { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title: { color: 'white', fontSize: '32px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  btnPrimary: { padding: '10px 20px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  formCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff15', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  label: { color: '#666', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'monospace' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  tableWrapper: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#ffffff08' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '1.5px', color: '#666', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#999', borderBottom: '1px solid #ffffff08' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' },
};

export default StockPage;