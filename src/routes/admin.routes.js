const express = require('express');
const router = express.Router();
const { 
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  sendNotification
} = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

// All routes require admin access
router.use(auth, admin);

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);

// Notification routes
router.post('/notifications', sendNotification);

module.exports = router; 