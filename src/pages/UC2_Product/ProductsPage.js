// StockPro Inventory Management System
// UC2 - Product Service | Page: Products List
// Developer: Suru | April 2026
// Description: GET /api/product → shows all products with search and filter

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../api';

function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const role = localStorage.getItem('stockpro_role');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.get('/api/product');
      setProducts(res.data);
    } catch (err) {
      console.log('Error loading products', err);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search) return loadProducts();
    try {
      const res = await productAPI.get(`/api/product/search/${search}`);
      setProducts(res.data);
    } catch (err) { console.log(err); }
  };

  const handleCategoryFilter = async () => {
    if (!category) return loadProducts();
    try {
      const res = await productAPI.get(`/api/product/category/${category}`);
      setProducts(res.data);
    } catch (err) { console.log(err); }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await productAPI.put(`/api/product/${id}/deactivate`);
      loadProducts();
    } catch (err) { alert('Error deactivating product'); }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.ucBadge}>UC2 · PRODUCT SERVICE</div>
          <h1 style={styles.title}>Product Catalogue</h1>
          <p style={styles.subtitle}>Manage your inventory product master data</p>
        </div>
        {(role === 'ADMIN' || role === 'MANAGER') && (
          <button onClick={() => navigate('/uc2/add-product')} style={styles.btnPrimary}>
            + Add Product
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div style={styles.searchBar}>
        <input
          placeholder="🔍 Search by name, SKU, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.btnSecondary}>Search</button>
        <input
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ ...styles.input, maxWidth: '200px' }}
        />
        <button onClick={handleCategoryFilter} style={styles.btnSecondary}>Filter</button>
        <button onClick={loadProducts} style={styles.btnGhost}>Reset</button>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { label: 'Total Products', value: products.length, icon: '📦' },
          { label: 'Active', value: products.filter(p => p.isActive).length, icon: '✅' },
          { label: 'Low Stock', value: products.filter(p => p.reorderLevel > 0).length, icon: '⚠️' },
          { label: 'Categories', value: [...new Set(products.map(p => p.category))].length, icon: '🏷️' }
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <span style={{ fontSize: '24px' }}>{s.icon}</span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e94560' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={styles.loading}>Loading products...</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Brand</th>
                <th style={styles.th}>Cost Price</th>
                <th style={styles.th}>Selling Price</th>
                <th style={styles.th}>Reorder Level</th>
                <th style={styles.th}>Barcode</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{
                  backgroundColor: i % 2 === 0 ? '#0f0f23' : '#0d0d1a',
                  transition: 'background 0.2s'
                }}>
                  <td style={styles.td}>
                    <span style={styles.skuBadge}>{p.sku}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 600, color: 'white' }}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>{p.brand}</td>
                  <td style={styles.td}>₹{p.costPrice}</td>
                  <td style={{ ...styles.td, color: '#4ade80' }}>₹{p.sellingPrice}</td>
                  <td style={styles.td}>{p.reorderLevel}</td>
                  <td style={{ ...styles.td, fontFamily: 'monospace', fontSize: '12px' }}>{p.barcode}</td>
                  <td style={styles.td}>
                    <span style={{
                      backgroundColor: p.isActive ? 'rgba(74,222,128,0.1)' : 'rgba(220,53,69,0.1)',
                      color: p.isActive ? '#4ade80' : '#dc3545',
                      border: `1px solid ${p.isActive ? 'rgba(74,222,128,0.3)' : 'rgba(220,53,69,0.3)'}`,
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px'
                    }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => navigate(`/uc2/product/${p.id}`)}
                        style={styles.btnView}>View</button>
                      {(role === 'ADMIN' || role === 'MANAGER') && p.isActive && (
                        <button
                          onClick={() => handleDeactivate(p.id)}
                          style={styles.btnDanger}>Deactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <div style={{ color: '#666' }}>No products found</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' },
  ucBadge: { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title: { color: 'white', fontSize: '32px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  btnPrimary: { padding: '12px 24px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { padding: '10px 16px', backgroundColor: '#ffffff10', color: 'white', border: '1px solid #ffffff20', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  btnGhost: { padding: '10px 16px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  btnView: { padding: '4px 10px', backgroundColor: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  btnDanger: { padding: '4px 10px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', flex: 1 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  tableWrapper: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#ffffff08' },
  th: { padding: '14px 16px', textAlign: 'left', fontSize: '11px', letterSpacing: '1.5px', color: '#666', fontWeight: 600, fontFamily: 'monospace', borderBottom: '1px solid #ffffff10' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#999', borderBottom: '1px solid #ffffff08' },
  skuBadge: { fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#ffffff08', padding: '3px 8px', borderRadius: '4px', color: '#e94560' },
  loading: { textAlign: 'center', padding: '60px', color: '#666' },
  empty: { textAlign: 'center', padding: '60px', color: '#666' }
};

export default ProductsPage;