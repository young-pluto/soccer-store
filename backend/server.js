const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./database');
const path = require('path');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); // header-based session id, so cookies not required cross-origin
app.use(bodyParser.json());
app.use(cookieParser());

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

// Session middleware: use x-session-id header or cookie sid; generate if absent
app.use((req, res, next) => {
  let sessionId = req.header('x-session-id') || req.cookies?.sid;
  if (!sessionId) {
    sessionId = uuidv4();
    // set a cookie for same-origin scenarios; header for clients to persist
    res.cookie('sid', sessionId, { httpOnly: false, sameSite: 'Lax' });
  }
  res.setHeader('x-session-id', sessionId);
  req.userId = sessionId;
  next();
});

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

// Centralized error handler (last)
app.use((err, req, res, _next) => {
  console.error('Error:', err);
  if (res.headersSent) return;
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});