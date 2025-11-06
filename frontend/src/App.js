import React, { useState } from 'react';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('products'); // products, cart, checkout
  const [cartCount, setCartCount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const handleCheckoutSuccess = (receiptData) => {
    setReceipt(receiptData);
    setShowReceipt(true);
    setCartCount(0);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setCurrentPage('products');
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo"> Soccer Store</h1>
          <nav className="nav">
            <button 
              className={currentPage === 'products' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentPage('products')}
            >
              Products
            </button>
            <button 
              className={currentPage === 'cart' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setCurrentPage('cart')}
            >
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'products' && (
          <Products updateCartCount={updateCartCount} />
        )}
        {currentPage === 'cart' && (
          <Cart 
            updateCartCount={updateCartCount} 
            goToCheckout={() => setCurrentPage('checkout')}
          />
        )}
        {currentPage === 'checkout' && (
          <Checkout 
            onSuccess={handleCheckoutSuccess}
            goBack={() => setCurrentPage('cart')}
          />
        )}
      </main>

      {/* Receipt Modal */}
      {showReceipt && receipt && (
        <div className="modal-overlay" onClick={closeReceipt}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="receipt">
              <h2>✅ Order Confirmed!</h2>
              <div className="receipt-details">
                <p><strong>Order ID:</strong> {receipt.orderId}</p>
                <p><strong>Customer:</strong> {receipt.customer.name}</p>
                <p><strong>Email:</strong> {receipt.customer.email}</p>
                <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
              </div>
              
              <div className="receipt-items">
                <h3>Items:</h3>
                {receipt.items.map((item, index) => (
                  <div key={index} className="receipt-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-total">
                <strong>Total: ${receipt.total.toFixed(2)}</strong>
              </div>

              <button className="btn btn-primary" onClick={closeReceipt}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;