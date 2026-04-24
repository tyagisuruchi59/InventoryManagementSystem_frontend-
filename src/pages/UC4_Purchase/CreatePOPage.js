// StockPro Inventory Management System
// UC4 - Purchase Service | Page: Create Purchase Order
// Developer: Suru | April 2026

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseAPI } from '../../api';

function CreatePOPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ supplierId: '', warehouseId: '', expectedDate: '', notes: '' });
  const [lineItems, setLineItems] = useState([{ productId: '', quantity: '', unitCost: '' }]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLineChange = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  };

  const addLineItem = () => setLineItems([...lineItems, { productId: '', quantity: '', unitCost: '' }]);
  const removeLineItem = (index) => { if (lineItems.length > 1) setLineItems(lineItems.filter((_, i) => i !== index)); };

  const totalAmount = lineItems.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.unitCost || 0)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await purchaseAPI.post('/api/purchase-orders', {
        supplierId: parseInt(form.supplierId),
        warehouseId: parseInt(form.warehouseId),
        expectedDate: form.expectedDate || null,
        notes: form.notes,
        lineItems: lineItems.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          unitCost: parseFloat(item.unitCost)
        }))
      });
      navigate('/uc4/purchase');
    } catch (err) {
      const msg = err.response?.data || err.response?.status;
      setError(`Error creating PO: ${msg}. Make sure Purchase Service is running and you are ADMIN/MANAGER.`);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={() => navigate('/uc4/purchase')} style={styles.backBtn}>← Back to POs</button>
        <div style={styles.ucBadge}>UC4 · CREATE PURCHASE ORDER</div>
        <h1 style={styles.title}>Create Purchase Order</h1>
        <p style={styles.subtitle}>New PO starts in DRAFT status</p>

        {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>PO Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={styles.label}>SUPPLIER ID</label>
                <input name="supplierId" type="number" placeholder="Enter supplier ID"
                  value={form.supplierId} onChange={handleFormChange} style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>WAREHOUSE ID</label>
                <input name="warehouseId" type="number" placeholder="Enter warehouse ID"
                  value={form.warehouseId} onChange={handleFormChange} style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>EXPECTED DELIVERY DATE</label>
                <input name="expectedDate" type="date"
                  value={form.expectedDate} onChange={handleFormChange} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>NOTES</label>
                <input name="notes" placeholder="Optional notes"
                  value={form.notes} onChange={handleFormChange} style={styles.input} />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={styles.sectionTitle}>Line Items</h3>
              <button type="button" onClick={addLineItem} style={styles.btnSecondary}>+ Add Item</button>
            </div>

            {lineItems.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
                <div>
                  <label style={styles.label}>PRODUCT ID</label>
                  <input type="number" placeholder="Product ID" value={item.productId}
                    onChange={e => handleLineChange(index, 'productId', e.target.value)}
                    style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>QUANTITY</label>
                  <input type="number" placeholder="Qty" value={item.quantity}
                    onChange={e => handleLineChange(index, 'quantity', e.target.value)}
                    style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>UNIT COST (₹)</label>
                  <input type="number" placeholder="Cost per unit" value={item.unitCost}
                    onChange={e => handleLineChange(index, 'unitCost', e.target.value)}
                    style={styles.input} required />
                </div>
                <button type="button" onClick={() => removeLineItem(index)}
                  style={{ padding: '10px', backgroundColor: 'rgba(220,53,69,0.1)', color: '#dc3545', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
              </div>
            ))}

            <div style={{ backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ color: '#666', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '1px' }}>TOTAL AMOUNT</span>
              <span style={{ color: '#4ade80', fontSize: '24px', fontWeight: 800 }}>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading} style={styles.btnPrimary}>
              {loading ? 'Creating...' : '+ Create Purchase Order'}
            </button>
            <button type="button" onClick={() => navigate('/uc4/purchase')} style={styles.btnGhost}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' },
  backBtn: { backgroundColor: 'transparent', border: '1px solid #333', color: '#666', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '16px', fontSize: '13px' },
  ucBadge: { display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '10px' },
  title: { color: 'white', fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '24px' },
  errorMsg: { backgroundColor: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', color: '#dc3545', padding: '12px', borderRadius: '8px', marginBottom: '20px' },
  section: { backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '12px', padding: '24px', marginBottom: '20px' },
  sectionTitle: { color: 'white', fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', fontFamily: 'monospace', letterSpacing: '1px' },
  label: { display: 'block', color: '#666', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: '#ffffff08', border: '1px solid #ffffff15', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  btnPrimary: { padding: '12px 24px', backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  btnSecondary: { padding: '8px 16px', backgroundColor: '#ffffff10', color: 'white', border: '1px solid #ffffff20', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  btnGhost: { padding: '12px 24px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
};

export default CreatePOPage;