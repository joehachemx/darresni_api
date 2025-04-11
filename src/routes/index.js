const express = require('express');
const router = express.Router();

// Import routes
const userRoutes = require('./user.routes');

// Use routes
router.use('/users', userRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router; 