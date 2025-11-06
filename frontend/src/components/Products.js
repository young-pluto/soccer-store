import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

function Products({ updateCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Ensure a persistent session id header for all requests
    let sid = localStorage.getItem('sid');
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('sid', sid);
    }
    axios.defaults.headers.common['x-session-id'] = sid;
    fetchProducts();
    fetchCart();
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

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`);
      setCartItems(response.data.cart);
      updateCartCount(response.data.cart.length);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const addToCart = async (productId) => {
    setAddingToCart({ ...addingToCart, [productId]: true });
    try {
      await axios.post(`${API_URL}/api/cart`, { productId, quantity: 1 });
      fetchCart();
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
        {products.map((product) => {
          const cartQuantity = getCartQuantity(product.id);
          return (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} className="product-image" />
                {cartQuantity > 0 && (
                  <span className="product-cart-badge">{cartQuantity}</span>
                )}
              </div>
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
          );
        })}
      </div>
    </div>
  );
}

export default Products;