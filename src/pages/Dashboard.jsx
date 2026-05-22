import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard-home">
      <h2>Welcome to Omega Dashboard 👋</h2>
      <p>Your product management & analytics platform.</p>
      <div className="quick-links">
        <div className="quick-card" onClick={() => navigate('/products')}>
          <span>📦</span>
          <h3>View Products</h3>
          <p>Browse, search and filter all products</p>
        </div>
        <div className="quick-card" onClick={() => navigate('/analytics')}>
          <span>📊</span>
          <h3>Analytics</h3>
          <p>Charts and stats on your inventory</p>
        </div>
      </div>
    </div>
  );
}