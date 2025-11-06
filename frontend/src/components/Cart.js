import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

function Cart({ updateCartCount, goToCheckout }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`);
      setCart(response.data.cart);
      setTotal(response.data.total);
      updateCartCount(response.data.cart.length);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/${cartId}`);
      fetchCart();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`${API_URL}/api/cart/${cartId}`, { quantity: newQuantity });
      fetchCart();
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear all items from your cart?')) {
      return;
    }
    try {
      // Delete all cart items one by one
      const deletePromises = cart.map(item => 
        axios.delete(`${API_URL}/api/cart/${item.cartId}`)
      );
      await Promise.all(deletePromises);
      fetchCart();
    } catch (err) {
      alert('Failed to clear cart');
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.cartId} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item-actions">
              <div className="quantity-controls">
                <button 
                  className="btn btn-small"
                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="btn btn-small"
                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="cart-item-subtotal">
                Subtotal: ${item.subtotal.toFixed(2)}
              </p>
              <button 
                className="btn btn-danger"
                onClick={() => removeFromCart(item.cartId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-actions-top">
          <button className="btn btn-secondary" onClick={clearCart}>
            🗑️ Clear All
          </button>
        </div>
        <div className="cart-total">
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
        <button className="btn btn-primary btn-large" onClick={goToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;