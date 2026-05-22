import React, { useMemo } from 'react';
import useProducts from '../hooks/useProducts';

export default function Analytics() {
  const { products, loading } = useProducts();

  const stats = useMemo(() => {
    if (!products || products.length === 0) return null;

    const totalProducts = products.length;

    // 1. Average Rating
    const totalRating = products.reduce((acc, p) => acc + (p.rating || 0), 0);
    const avgRating = (totalRating / totalProducts).toFixed(2);

    // 2. Total Inventory Value (Price * Stock)
    const totalInventoryValue = products.reduce((acc, p) => {
      return acc + ((p.price || 0) * (p.stock || 0));
    }, 0);

    // 3. Category Distribution
    const categoryCounts = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalProducts,
      avgRating,
      totalInventoryValue: totalInventoryValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      categoryCounts
    };
  }, [products]);

  if (loading) return <div className="loading">Loading analytics data...</div>;
  if (!stats) return <div className="no-data">No data available to process.</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Analytics Dashboard</h1>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Total Products</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px', color: '#111827' }}>{stats.totalProducts}</p>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Average Rating</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px', color: '#f59e0b' }}>⭐ {stats.avgRating}</p>
        </div>
        
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Total Inventory Value</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px', color: '#10b981' }}>{stats.totalInventoryValue}</p>
        </div>
      </div>

      {/* Category Breakdown list */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Category Distribution</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(stats.categoryCounts).map(([category, count]) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
              <span style={{ textTransform: 'capitalize', width: '150px', fontSize: '14px' }}>{category}</span>
              <div style={{ flexGrow: 1, backgroundColor: '#f3f4f6', height: '8px', borderRadius: '4px', margin: '0 16px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#4f46e5', height: '100%', width: `${(count / stats.totalProducts) * 100}%` }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', width: '60px', textAlign: 'right' }}>{count} items</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}