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

router.post('/', validate(createExerciseSchema), createExercise);
router.get('/', getAllExercises);
router.get('/:id', getExerciseById);
router.put('/:id', validate(updateExerciseSchema), updateExercise);
router.delete('/:id', deleteExercise);

module.exports = router; 