// StockPro Inventory Management System
// UC2 - Product Service | Page: Add Product
// Developer: Suru | April 2026
// Description: POST /api/product → creates new product

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../api';

function AddProductPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    sku: '', name: '', description: '', category: '',
    brand: '', unitOfMeasure: '', costPrice: '',
    sellingPrice: '', barcode: '', reorderLevel: '',
    maxStockLevel: '', leadTimeDays: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await productAPI.post('/api/product', {
        ...form,
        costPrice: parseFloat(form.costPrice),
        sellingPrice: parseFloat(form.sellingPrice),
        reorderLevel: parseInt(form.reorderLevel),
        maxStockLevel: parseInt(form.maxStockLevel),
        leadTimeDays: parseInt(form.leadTimeDays)
      });
      setSuccess('Product created successfully!');
      setTimeout(() => navigate('/uc2/products'), 1500);
    } catch (err) {
      setError('Error creating product. Check if SKU already exists.');
    }
    setLoading(false);
  };

  const fields = [
    { name: 'sku', label: 'SKU', placeholder: 'e.g. PROD-001', type: 'text' },
    { name: 'name', label: 'Product Name', placeholder: 'e.g. Dell Laptop', type: 'text' },
    { name: 'category', label: 'Category', placeholder: 'e.g. Electronics', type: 'text' },
    { name: 'brand', label: 'Brand', placeholder: 'e.g. Dell', type: 'text' },
    { name: 'unitOfMeasure', label: 'Unit of Measure', placeholder: 'e.g. pieces, kg', type: 'text' },
    { name: 'barcode', label: 'Barcode', placeholder: 'e.g. 1234567890', type: 'text' },
    { name: 'costPrice', label: 'Cost Price (₹)', placeholder: '0.00', type: 'number' },
    { name: 'sellingPrice', label: 'Selling Price (₹)', placeholder: '0.00', type: 'number' },
    { name: 'reorderLevel', label: 'Reorder Level', placeholder: 'Min stock before alert', type: 'number' },
    { name: 'maxStockLevel', label: 'Max Stock Level', placeholder: 'Max stock threshold', type: 'number' },
    { name: 'leadTimeDays', label: 'Lead Time (days)', placeholder: 'Days to receive from supplier', type: 'number' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate('/uc2/products')} style={styles.backBtn}>
            ← Back
          </button>
          <div style={styles.ucBadge}>UC2 · ADD PRODUCT</div>
          <h1 style={styles.title}>Add New Product</h1>
          <p style={styles.subtitle}>Create a new product in the inventory catalogue</p>
        </div>

        {/* Messages */}
        {error && <div style={styles.errorMsg}>⚠️ {error}</div>}
        {success && <div style={styles.successMsg}>✅ {success}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            {fields.map(f => (
              <div key={f.name} style={styles.formGroup}>
                <label style={styles.label}>{f.label}</label>
                <input
                  name={f.name} type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  onFocus={e => e.target.style.border = '1px solid #e94560'}
                  onBlur={e => e.target.style.border = '1px solid #ffffff15'}
                />
              </div>
            ))}
          </div>

          {/* Description full width */}
          <div style={{ ...styles.formGroup, marginTop: '16px' }}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              placeholder="Enter product description..."
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="submit" disabled={loading} style={styles.btnPrimary}>
              {loading ? 'Creating...' : '+ Create Product'}
            </button>
            <button type="button" onClick={() => navigate('/uc2/products')} style={styles.btnGhost}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  backBtn: { backgroundColor: 'transparent', border: '1px solid #333', color: '#666', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '16px', fontSize: '13px' },
  ucBadge: { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title: { color: 'white', fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' },
  successMsg: { backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#999', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'monospace' },
  input: { padding: '12px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btnPrimary: { padding: '13px 28px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  btnGhost: { padding: '13px 28px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }
};

export default AddProductPage;