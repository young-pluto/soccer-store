import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

function Products({ updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data.products);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`);
      updateCartCount(response.data.cart.length);
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const addToCart = async (productId) => {
    setAddingToCart({ ...addingToCart, [productId]: true });
    try {
      await axios.post(`${API_URL}/api/cart`, { productId, quantity: 1 });
      fetchCartCount();
      setTimeout(() => {
        setAddingToCart({ ...addingToCart, [productId]: false });
      }, 500);
    } catch (err) {
      alert('Failed to add item to cart');
      setAddingToCart({ ...addingToCart, [productId]: false });
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="products-container">
      <h2>Our Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <button 
                  className={`btn btn-primary ${addingToCart[product.id] ? 'btn-success' : ''}`}
                  onClick={() => addToCart(product.id)}
                  disabled={addingToCart[product.id]}
                >
                  {addingToCart[product.id] ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;