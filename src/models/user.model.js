const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { firstName, lastName, email, password, phoneNumber, dob } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      `INSERT INTO users (firstName, lastName, email, password, phoneNumber, dob, streak) 
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [firstName, lastName, email, hashedPassword, phoneNumber, dob]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updateStreak(id, streak) {
    await pool.execute(
      'UPDATE users SET streak = ? WHERE id = ?',
      [streak, id]
    );
  }

  static async updateProfile(id, updateData) {
    const allowedFields = ['firstName', 'lastName', 'phoneNumber', 'dob'];
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
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    await pool.execute(query, values);
    return this.findById(id);
  }

  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }

  static async delete(id) {
    await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
  }
}

module.exports = User; 