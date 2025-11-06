const express = require('express');
const { db } = require('../database');
const router = express.Router();

// POST /api/checkout - Process checkout
router.post('/', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Get cart items with details
  const query = `
    SELECT 
      cart.id as cartId,
      cart.productId,
      cart.quantity,
      products.name,
      products.price,
      (cart.quantity * products.price) as subtotal
    FROM cart
    JOIN products ON cart.productId = products.id
  `;

  db.all(query, [], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const timestamp = new Date().toISOString();

    // Create mock receipt
    const receipt = {
      orderId: `ORD-${Date.now()}`,
      customer: {
        name,
        email
      },
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: parseFloat(item.subtotal.toFixed(2))
      })),
      total: parseFloat(total.toFixed(2)),
      timestamp,
      status: 'confirmed'
    };

    // Clear cart after checkout
    db.run('DELETE FROM cart', [], (err) => {
      if (err) {
        console.error('Error clearing cart:', err);
      }
    });

    res.json({
      message: 'Checkout successful',
      receipt
    });
  });
});

module.exports = router;