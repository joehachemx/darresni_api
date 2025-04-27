const express = require('express');
const router = express.Router();
const { 
  createExercise, 
  getAllExercises, 
  getExerciseById, 
  updateExercise, 
  deleteExercise,
  getCorrectAnswer
} = require('../controllers/exercise.controller');
const { 
  createExerciseSchema, 
  updateExerciseSchema,
  correctAnswerSchema
} = require('../validators/exercise.validator');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

// Auth Routes
router.get('/', auth, getAllExercises);
router.get('/:id', auth, getExerciseById);
router.post('/correct', auth, validate(correctAnswerSchema), getCorrectAnswer);

// Admin only routes
router.post('/', auth, admin, validate(createExerciseSchema), createExercise);
router.put('/:id', auth, admin, validate(updateExerciseSchema), updateExercise);
router.delete('/:id', auth, admin, deleteExercise);

module.exports = router; 