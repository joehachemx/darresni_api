const PerformanceLog = require('../models/performanceLog.model');
const User = require('../models/user.model');
const Exercise = require('../models/exercise.model');
const { successResponse, errorResponse } = require('../utils/response');

exports.createPerformanceLog = async (req, res) => {
  try {
    const { exerciseId, performance, userInput, correction } = req.body;
    const userId = req.user.id;

    // Validate user and exercise exist
    const user = await User.findById(userId);
    const exercise = await Exercise.findById(exerciseId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    if (!exercise) {
      return errorResponse(res, 'Exercise not found', 404);
    }

    const logId = await PerformanceLog.create({
      userId,
      exerciseId,
      performance,
      userInput,
      correction
    });
    
    successResponse(res, { id: logId }, 'Performance log created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getUserPerformanceLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await PerformanceLog.getByUserId(userId);
    successResponse(res, logs);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getExercisePerformanceLogs = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const userId = req.user.id;

    // Check if user has attempted this exercise
    const userAttempts = await PerformanceLog.getByUserAndExercise(userId, exerciseId);
    if (userAttempts.length === 0) {
      return errorResponse(res, 'You must attempt this exercise first', 403);
    }

    const logs = await PerformanceLog.getByExerciseId(exerciseId);
    successResponse(res, logs);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

exports.getUserExercisePerformanceLogs = async (req, res) => {
  try {
    const { userId, exerciseId } = req.params;
    const currentUserId = req.user.id;

    // Check if current user has attempted this exercise
    const userAttempts = await PerformanceLog.getByUserAndExercise(currentUserId, exerciseId);
    if (userAttempts.length === 0) {
      return errorResponse(res, 'You must attempt this exercise first', 403);
    }

    const logs = await PerformanceLog.getByUserAndExercise(userId, exerciseId);
    successResponse(res, logs);
  } catch (error) {
    errorResponse(res, error.message);
  }
}; 