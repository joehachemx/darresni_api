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

router.use(auth);

// router.post('/', validate(createPerformanceLogSchema), createPerformanceLog);
router.get('/', getUserPerformanceLogs);
router.get('/exercise/:exerciseId', getExercisePerformanceLogs);
router.get('/exercise/:exerciseId/user/:userId', getUserExercisePerformanceLogs);

module.exports = router; 