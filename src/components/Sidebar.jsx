import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">⚡ Omega</div>
      <nav>
        <NavLink to="/" end><span>🏠 Dashboard</span></NavLink>
        <NavLink to="/products"><span>📦 Products</span></NavLink>
        <NavLink to="/analytics"><span>📊 Analytics</span></NavLink>
      </nav>
    </div>
  );
}