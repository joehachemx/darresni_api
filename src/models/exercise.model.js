const pool = require('../config/database');

class Exercise {
  static async create(exerciseData) {
    const { title, description, content, difficulty, exo_type } = exerciseData;
    
    const [result] = await pool.execute(
      `INSERT INTO exercises (title, description, content, difficulty, exo_type) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, content, difficulty, exo_type]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM exercises');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM exercises WHERE id = ?',
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
    const query = `UPDATE exercises SET ${updates.join(', ')} WHERE id = ?`;
    
    await pool.execute(query, values);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute(
      'DELETE FROM exercises WHERE id = ?',
      [id]
    );
  }
}

module.exports = Exercise; 