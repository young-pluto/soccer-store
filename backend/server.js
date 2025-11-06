const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Initialize database
initializeDatabase();

// Routes
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/checkout', checkoutRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Vibe Commerce API is running!' });
});

// Serve React build for same-origin setup
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath));
// SPA fallback - must be last (Express 5 compatible, catches all unmatched routes)
app.use((req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});