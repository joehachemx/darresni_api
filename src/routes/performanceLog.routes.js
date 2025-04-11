const express = require('express');
const router = express.Router();
const { 
  createPerformanceLog,
  getUserPerformanceLogs,
  getExercisePerformanceLogs,
  getUserExercisePerformanceLogs
} = require('../controllers/performanceLog.controller');
const { createPerformanceLogSchema } = require('../validators/performanceLog.validator');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(auth);

// Create a new performance log
router.post('/', validate(createPerformanceLogSchema), createPerformanceLog);

// Get all performance logs for the authenticated user
router.get('/my-logs', getUserPerformanceLogs);

// Get all performance logs for an exercise (only if user has attempted it)
router.get('/exercise/:exerciseId', getExercisePerformanceLogs);

// Get performance logs for a specific user and exercise (only if user has attempted it)
router.get('/exercise/:exerciseId/user/:userId', getUserExercisePerformanceLogs);

module.exports = router; 