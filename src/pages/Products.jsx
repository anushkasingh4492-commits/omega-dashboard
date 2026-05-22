import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

export default function Products() {
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const PER_PAGE = 12;

  const debouncedSearch = useDebounce(search, 400);

  // BONUS REQUIREMENT: Card Visibility States
  const [visibleFields, setVisibleFields] = useState({
    image: true,
    category: true,
    price: true,
    rating: true,
    stock: true
  });

  const toggleField = (field) => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (page > 1) params.page = page;
    setSearchParams(params);
  }, [debouncedSearch, category, sort, page, setSearchParams]);

  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (debouncedSearch) {
      list = list.filter(p => p.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    if (category) {
      list = list.filter(p => p.category === category);
    }
    if (sort === 'price') list.sort((a, b) => a.price - b.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [products, debouncedSearch, category, sort]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleSort = useCallback((val) => {
    setSort(val);
    setPage(1);
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div>
      {/* Filters Bar (Kept intact) */}
      <div className="filters-bar">
        <input
          className="search-input"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={sort} onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="name">Name A-Z</option>
        </select>
        <span className="results-count">{filtered.length} products</span>
      </div>

      {/* NEW BONUS REQUIREMENT UI: Field Customization Toggle Toggles */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', margin: '12px 0', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '13px' }}>
        <span style={{ fontWeight: '600', color: '#4b5563' }}>Customize Visible Info:</span>
        {Object.keys(visibleFields).map(field => (
          <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', textTransform: 'capitalize' }}>
            <input
              type="checkbox"
              checked={visibleFields[field]}
              onChange={() => toggleField(field)}
            />
            {field}
          </label>
        ))}
      </div>

      {/* Product Grid Layout */}
      <div className="className=product-grid">
        {paginated.map(p => (
          <div key={p.id} className="product-card" onClick={() => navigate(`/products/${p.id}`)}>
            
            {/* Conditional Image Field Toggle */}
            {visibleFields.image && (
              <img src={p.thumbnail} alt={p.title} loading="lazy" />
            )}

            <div className="card-body">
              {/* Conditional Category Toggle */}
              {visibleFields.category && (
                <span className="category-tag">{p.category}</span>
              )}

              <h3>{p.title}</h3>

              <div className="card-footer">
                {/* Conditional Price Toggle */}
                {visibleFields.price && (
                  <span className="price">${p.price}</span>
                )}

                {/* Conditional Rating Toggle */}
                {visibleFields.rating && (
                  <span className="rating">⭐ {p.rating}</span>
                )}

                {/* Conditional Stock Toggle */}
                {visibleFields.stock && (
                  <span className={`stock ${p.stock < 10 ? 'Low' : ''}`}>
                    {p.stock < 10 ? '⚠️ Low' : '✅ In Stock'}
                  </span>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Pagination Logic Control */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages || 1}</span>
        <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}