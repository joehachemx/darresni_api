const pool = require('../config/database');

class Exercise {
  static async create(exerciseData) {
    const { title, description, content, difficulty, exo_type } = exerciseData;
    
    const [result] = await pool.execute(
      `INSERT INTO exercise (title, description, content, difficulty, exo_type) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, content, difficulty, exo_type]
    );
    return result.insertId;
  }

  static async findAll(userId) {
    const [rows] = await pool.execute('SELECT * FROM exercise');
    
    if (userId) {
      const [attempts] = await pool.execute(
        'SELECT exerciseId FROM PerformanceLogs WHERE userId = ?',
        [userId]
      );
      const attemptedExerciseIds = new Set(attempts.map(a => a.exerciseId));
      
      return rows.map(exercise => ({
        ...exercise,
        hasAttempted: attemptedExerciseIds.has(exercise.id)
      }));
    }
    
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM exercise WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, updateData) {
    const allowedFields = ['title', 'description', 'content', 'difficulty', 'exo_type'];
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) return null;

    values.push(id);
    const query = `UPDATE exercise SET ${updates.join(', ')} WHERE id = ?`;
    
    await pool.execute(query, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute(
      'DELETE FROM exercise WHERE id = ?',
      [id]
    );
  }
}

module.exports = Exercise; 