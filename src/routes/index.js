const express = require('express');
const router = express.Router();

// Import routes
const userRoutes = require('./user.routes');
const exerciseRoutes = require('./exercise.routes');

// Version 1 routes
const v1Router = express.Router();
v1Router.use('/users', userRoutes);
v1Router.use('/exercises', exerciseRoutes);

// Mount versioned routes
router.use('/v1', v1Router);

// Health check route (not versioned)
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router; 