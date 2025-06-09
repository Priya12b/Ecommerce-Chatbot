// File: frontend/src/Products.js

import React, { useState, useEffect  , useCallback} from 'react';
import { fetchProducts } from './api';

/**
 * Products component.
 * Displays a list of products with filter options and error handling.
 */
export default function Products() {
  // State variables for product list, filters, loading, and error messages
  const [products, setProducts] = useState([]);
  // const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [error, setError] = useState(null);

  /**
   * Fetch products from backend with current filters.
   * Handles errors and updates loading state.
   */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (name) filters.name = name;
      if (category) filters.category = category;
      if (minPrice) filters.price_min = minPrice;
      if (maxPrice) filters.price_max = maxPrice;

      const products = await fetchProducts(filters);
      if (products.error) {
        setError(products.error);
        setProducts([]);
      } else {
        setProducts(products);
      }
    } catch (err) {
      setError('Failed to load products.');
      setProducts([]);
    }
    setLoading(false);
  }, [name, category, minPrice, maxPrice]);

  // Load products on component mount and when filters change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /**
   * Handle filter form submission.
   * Prevents default form behavior and reloads products.
   */
  function handleFilterSubmit(e) {
    e.preventDefault();
    loadProducts();
  }

  return (
    <div>
      <h2>Products</h2>
      {/* Filter form for product name, category, and price range */}
      <form onSubmit={handleFilterSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginRight: '10px', width: '100px' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ marginRight: '10px', width: '100px' }}
        />
        <br />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          style={{ marginRight: '10px', width: '100px' }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          style={{ marginRight: '10px', width: '100px' }}
        />
        <br />
        <button type="submit">Filter</button>
        <button
          type="button"
          style={{ marginLeft: '10px' }}
          onClick={() => {
            // Reset all filters and reload products
            setName('');
            setCategory('');
            setMinPrice('');
            setMaxPrice('');
            loadProducts();
          }}
        >
          Reset Filters
        </button>
      </form>

      {/* Loading, error, and empty state messages */}
      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && products.length === 0 && <p>No products found.</p>}

      {/* Product list */}
      <ul>
        {products.map(p => (
          <li key={p.id} style={{ margin: '10px 0', borderBottom: '1px solid #ccc' }}>
            <strong>{p.name}</strong> - ₹{p.price}
            <br />
            Category: {p.category}
            <br />
            {p.description}
          </li>
        ))}
      </ul>
    </div>
  );
}