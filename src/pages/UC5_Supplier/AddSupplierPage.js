// StockPro Inventory Management System
// UC5 - Supplier Service | Page: Add Supplier
// Developer: Suru | April 2026

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierAPI } from '../../api';

function AddSupplierPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    city: '', country: 'India',
    taxId: '', contactPerson: '',
    paymentTerms: '', leadTimeDays: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await supplierAPI.post('/api/suppliers', {
        ...form,
        leadTimeDays: form.leadTimeDays ? parseInt(form.leadTimeDays) : 0
      });
      navigate('/uc5/suppliers');
    } catch (err) {
      const msg = err.response?.data || err.response?.status;
      setError(`Error: ${msg}`);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/uc5/suppliers')} style={styles.backBtn}>← Back to Suppliers</button>
        <div style={styles.ucBadge}>UC5 · ADD SUPPLIER</div>
        <h1 style={styles.title}>Add New Supplier</h1>
        <p style={styles.subtitle}>Register a new vendor in the system</p>

        {error && <div style={styles.errorMsg}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Supplier Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>

              <div>
                <label style={styles.label}>COMPANY NAME *</label>
                <input name="name" placeholder="Supplier company name"
                  value={form.name} onChange={handleChange} style={styles.input} required />
              </div>

              <div>
                <label style={styles.label}>EMAIL *</label>
                <input name="email" type="email" placeholder="contact@supplier.com"
                  value={form.email} onChange={handleChange} style={styles.input} required />
              </div>

              <div>
                <label style={styles.label}>PHONE *</label>
                <input name="phone" placeholder="+91 98765 43210"
                  value={form.phone} onChange={handleChange} style={styles.input} required />
              </div>

              <div>
                <label style={styles.label}>CONTACT PERSON</label>
                <input name="contactPerson" placeholder="Primary contact name"
                  value={form.contactPerson} onChange={handleChange} style={styles.input} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>ADDRESS</label>
                <input name="address" placeholder="Street address"
                  value={form.address} onChange={handleChange} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>CITY</label>
                <input name="city" placeholder="City e.g. Mumbai"
                  value={form.city} onChange={handleChange} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>COUNTRY</label>
                <input name="country" placeholder="Country"
                  value={form.country} onChange={handleChange} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>TAX ID (GST NUMBER) *</label>
                <input name="taxId" placeholder="e.g. 27AAPFU0939F1ZV"
                  value={form.taxId} onChange={handleChange} style={styles.input} required />
              </div>

              <div>
                <label style={styles.label}>PAYMENT TERMS</label>
                <input name="paymentTerms" placeholder="e.g. Net 30"
                  value={form.paymentTerms} onChange={handleChange} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>LEAD TIME (DAYS)</label>
                <input name="leadTimeDays" type="number" placeholder="e.g. 7"
                  value={form.leadTimeDays} onChange={handleChange} style={styles.input} />
              </div>

            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={loading} style={styles.btnPrimary}>
              {loading ? 'Saving...' : '+ Add Supplier'}
            </button>
            <button type="button" onClick={() => navigate('/uc5/suppliers')} style={styles.btnGhost}>Cancel</button>
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
  btnGhost: { padding: '12px 24px', backgroundColor: 'transparent', color: '#666', border: '1px solid #333', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
};

export default AddSupplierPage;