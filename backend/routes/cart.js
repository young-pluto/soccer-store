const express = require('express');
const { db } = require('../database');
const router = express.Router();

// GET /api/cart - Get all cart items with product details and total
router.get('/', (req, res) => {
  const query = `
    SELECT 
      cart.id as cartId,
      cart.productId,
      cart.quantity,
      products.name,
      products.price,
      products.image,
      (cart.quantity * products.price) as subtotal
    FROM cart
    JOIN products ON cart.productId = products.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total = rows.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      cart: rows,
      total: parseFloat(total.toFixed(2))
    });
  });
});

// POST /api/cart - Add item to cart
router.post('/', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Check if product exists
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    db.get('SELECT * FROM cart WHERE productId = ?', [productId], (err, cartItem) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (cartItem) {
        // Update quantity
        const newQuantity = cartItem.quantity + quantity;
        db.run(
          'UPDATE cart SET quantity = ? WHERE id = ?',
          [newQuantity, cartItem.id],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ 
              message: 'Cart updated successfully',
              cartId: cartItem.id,
              quantity: newQuantity
            });
          }
        );
      } else {
        // Insert new item
        db.run(
          'INSERT INTO cart (productId, quantity) VALUES (?, ?)',
          [productId, quantity],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
              message: 'Item added to cart',
              cartId: this.lastID,
              productId,
              quantity
            });
          }
        );
      }
    });
  });
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM cart WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  });
});

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Valid quantity is required' });
  }

  db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Cart item updated', quantity });
  });
});

module.exports = router;