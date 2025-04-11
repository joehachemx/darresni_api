const Exercise = require('../models/exercise.model');
const { successResponse, errorResponse } = require('../utils/response');

exports.createExercise = async (req, res) => {
  try {
    const exerciseId = await Exercise.create(req.body);
    const exercise = await Exercise.findById(exerciseId);
    successResponse(res, exercise, 'Exercise created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    successResponse(res, exercises);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return errorResponse(res, 'Exercise not found', 404);
    }
    successResponse(res, exercise);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const exercise = await Exercise.update(req.params.id, req.body);
    if (!exercise) {
      return errorResponse(res, 'Exercise not found', 404);
    }
    successResponse(res, exercise, 'Exercise updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return errorResponse(res, 'Exercise not found', 404);
    }
    await Exercise.delete(req.params.id);
    successResponse(res, null, 'Exercise deleted successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
}; 