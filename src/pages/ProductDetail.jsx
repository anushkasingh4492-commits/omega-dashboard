
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(r => r.json())
      .then(setProduct);
  }, [id]);

  if (!product) return <div className="loading">Loading product...</div>;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-grid">
        {/* Image Carousel */}
        <div className="carousel">
          <img src={product.images[imgIndex]} alt={product.title} className="main-img" />
          <div className="thumbnails">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`thumb ${i === imgIndex ? 'active' : ''}`}
                onClick={() => setImgIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="detail-info">
          <span className="category-tag">{product.category}</span>
          <h2>{product.title}</h2>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Price</span>
              <span className="meta-value price">${product.price}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Rating</span>
              <span className="meta-value">⭐ {product.rating}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock</span>
              <span className={`meta-value ${product.stock < 10 ? 'stock low' : 'stock'}`}>
                {product.stock} units
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Brand</span>
              <span className="meta-value">{product.brand}</span>
            </div>
          </div>

          <div className="tags">
            {product.tags?.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}