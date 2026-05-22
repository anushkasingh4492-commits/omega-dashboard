import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import useProducts from '../hooks/useProducts';

const COLORS = ['#7c6ef7', '#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#ec4899'];

export default function Analytics() {
  const { products, loading } = useProducts();

  const stats = useMemo(() => {
    if (!products.length) return null;
    const total = products.length;
    const avgRating = (products.reduce((s, p) => s + p.rating, 0) / total).toFixed(2);
    const totalInventory = products.reduce((s, p) => s + p.stock * p.price, 0).toFixed(0);

    const categoryMap = {};
    products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });
    const categoryData = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { total, avgRating, totalInventory, categoryData };
  }, [products]);

  if (loading || !stats) return <div className="loading">Loading analytics...</div>;

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p className="stat-label">Total Products</p>
            <h2 className="stat-value">{stats.total}</h2>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <div>
            <p className="stat-label">Average Rating</p>
            <h2 className="stat-value">{stats.avgRating}</h2>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <p className="stat-label">Inventory Value</p>
            <h2 className="stat-value">${Number(stats.totalInventory).toLocaleString()}</h2>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🗂️</span>
          <div>
            <p className="stat-label">Categories</p>
            <h2 className="stat-value">{stats.categoryData.length}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-box">
          <h3>Products by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.categoryData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7c6ef7" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stats.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {stats.categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}