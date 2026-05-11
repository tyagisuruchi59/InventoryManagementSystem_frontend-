// StockPro Inventory Management System
// UC2 - Product Service | Page: Product Detail
// Developer: Suru | April 2026
// Description: GET /api/product/{id} → shows full product details

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../api';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await productAPI.get(`/api/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  if (loading) return <div style={{ backgroundColor: '#0d0d1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading...</div>;
  if (!product) return <div style={{ backgroundColor: '#0d0d1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Product not found</div>;

  const details = [
    { label: 'SKU', value: product.sku, mono: true },
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand },
    { label: 'Unit of Measure', value: product.unitOfMeasure },
    { label: 'Barcode', value: product.barcode, mono: true },
    { label: 'Cost Price', value: `₹${product.costPrice}` },
    { label: 'Selling Price', value: `₹${product.sellingPrice}`, highlight: true },
    { label: 'Reorder Level', value: product.reorderLevel },
    { label: 'Max Stock Level', value: product.maxStockLevel },
    { label: 'Lead Time', value: `${product.leadTimeDays} days` },
    { label: 'Status', value: product.isActive ? 'Active' : 'Inactive' },
    { label: 'Created At', value: new Date(product.createdAt).toLocaleDateString() },
  ];

  return (
    <div style={{ backgroundColor: '#0d0d1a', minHeight: '100vh', padding: '30px', color: '#ccc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/uc2/products')}
          style={{ backgroundColor: 'transparent', border: '1px solid #333', color: '#666', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px', fontSize: '13px' }}>
          ← Back to Products
        </button>

        <div style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: '#e94560', backgroundColor: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', padding: '4px 10px', borderRadius: '4px', marginBottom: '12px' }}>
          UC2 · PRODUCT DETAIL
        </div>

        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>{product.name}</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>{product.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {details.map((d, i) => (
            <div key={i} style={{ backgroundColor: '#0f0f23', border: '1px solid #ffffff10', borderRadius: '10px', padding: '16px' }}>
              <div style={{ color: '#444', fontSize: '10px', letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: '8px' }}>{d.label}</div>
              <div style={{
                color: d.highlight ? '#4ade80' : 'white',
                fontSize: '16px', fontWeight: 600,
                fontFamily: d.mono ? 'monospace' : 'inherit'
              }}>{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;