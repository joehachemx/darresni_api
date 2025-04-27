const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    try {
      const { firstName, lastName, email, password, phoneNumber, dob, streak = 0, isAdmin = false } = userData;
      console.log('Creating user with data:', { firstName, lastName, email, phoneNumber, dob, streak, isAdmin });
      
      const [result] = await pool.execute(
        `INSERT INTO user (firstName, lastName, email, password, phoneNumber, dob, streak, isAdmin) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email, password, phoneNumber, dob, streak, isAdmin]
      );
      console.log('User created successfully, ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Database error in User.create:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async updateStreak(id, streak) {
    await pool.execute(
      'UPDATE user SET streak = ? WHERE id = ?',
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
    const query = `UPDATE user SET ${updates.join(', ')} WHERE id = ?`;
    
    await pool.execute(query, values);
    return this.findById(id);
  }

  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE user SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }

  static async delete(id) {
    await pool.execute(
      'DELETE FROM user WHERE id = ?',
      [id]
    );
  }
}

module.exports = User; 