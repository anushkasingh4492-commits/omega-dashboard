import { useState, useEffect } from 'react';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=100')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}