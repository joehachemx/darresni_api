const pool = require('../config/database');

class PerformanceLog {
  static async create(logData) {
    const { userId, exerciseId, performance, userInput, correction } = logData;
    
    const [result] = await pool.execute(
      `INSERT INTO PerformanceLogs (userId, exerciseId, performance, userInput, correction) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, exerciseId, performance, userInput, correction]
    );
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT * FROM PerformanceLogs WHERE userId = ? ORDER BY timestamp DESC`,
      [userId]
    );
    return rows;
  }

  static async getByExerciseId(exerciseId) {
    const [rows] = await pool.execute(
      `SELECT * FROM PerformanceLogs WHERE exerciseId = ? ORDER BY timestamp DESC`,
      [exerciseId]
    );
    return rows;
  }

  static async getByUserAndExercise(userId, exerciseId) {
    const [rows] = await pool.execute(
      `SELECT * FROM PerformanceLogs 
       WHERE userId = ? AND exerciseId = ? 
       ORDER BY timestamp DESC`,
      [userId, exerciseId]
    );
    return rows;
  }
}

module.exports = PerformanceLog; 