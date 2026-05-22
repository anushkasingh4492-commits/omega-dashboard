import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';

function Layout({ title, children }) {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar title={title} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout title="Dashboard"><Dashboard /></Layout>} />
        <Route path="/products" element={<Layout title="Products"><Products /></Layout>} />
        <Route path="/products/:id" element={<Layout title="Product Detail"><ProductDetail /></Layout>} />
        <Route path="/analytics" element={<Layout title="Analytics"><Analytics /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}