const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();

// Ensure uploads directory exists for image storage
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configuration supporting all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// ==================== ROUTES ====================

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/products', require('./routes/productRoutes'));

app.use('/api/cart', require('./routes/cartRoutes'));

app.use('/api/orders', require('./routes/orderRoutes'));

app.use('/api/addresses', require('./routes/addressRoutes'));

app.use('/api/reviews', require('./routes/reviewRoutes'));

// Wishlist
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/chat', require('./routes/chatRoutes'));

// ==================== ROOT ROUTE ====================

app.get('/', (req, res) => {
  res.send('SHOPEZ API is running');
});

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || 'Server error',
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ==================== UNHANDLED ERRORS ====================

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});