const Exercise = require('../models/exercise.model');
const { successResponse, errorResponse } = require('../utils/response');
const PerformanceLog = require('../models/performanceLog.model');
const { correctExercise } = require('../services/openai.service');
const pool = require('../config/database');

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
    const exercises = await Exercise.findAll(req.user?.id);
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

exports.getCorrectAnswer = async (req, res) => {
  try {
    const { exerciseId, userAnswer } = req.body;
    const userId = req.user.id;

    // Get the exercise
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return errorResponse(res, 'Exercise not found', 404);
    }

    // Get AI evaluation
    const { score, feedback } = await correctExercise({
      ...exercise,
      userAnswer
    });

    // Check if user has answered today
    const today = new Date().toISOString().split('T')[0];
    const [todayLogs] = await pool.execute(
      `SELECT * FROM PerformanceLogs 
       WHERE userId = ? AND DATE(timestamp) = ?`,
      [userId, today]
    );

    // Create performance log
    const logId = await PerformanceLog.create({
      userId,
      exerciseId,
      performance: score,
      userInput: userAnswer,
      correction: feedback
    });

    // If this is the first answer today, increment streak
    if (todayLogs.length === 0) {
      await pool.execute(
        `UPDATE Users SET streak = COALESCE(streak, 0) + 1 WHERE id = ?`,
        [userId]
      );
    }

    successResponse(res, {
      score,
      feedback,
      logId
    });
  } catch (error) {
    errorResponse(res, error.message);
  }
}; 