const express = require('express');
const router = express.Router();
const { 
  createExercise, 
  getAllExercises, 
  getExerciseById, 
  updateExercise, 
  deleteExercise 
} = require('../controllers/exercise.controller');
const { 
  createExerciseSchema, 
  updateExerciseSchema 
} = require('../validators/exercise.validator');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

// Public routes
router.get('/', getAllExercises);
router.get('/:id', getExerciseById);

// Admin only routes
router.post('/', auth, admin, validate(createExerciseSchema), createExercise);
router.put('/:id', auth, admin, validate(updateExerciseSchema), updateExercise);
router.delete('/:id', auth, admin, deleteExercise);

module.exports = router; 