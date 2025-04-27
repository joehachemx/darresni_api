const pool = require('../config/database');

class StreakService {
  static async resetInactiveStreaks() {
    try {
      // Get yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Find users who didn't answer yesterday
      const [inactiveUsers] = await pool.execute(`
        SELECT DISTINCT u.id 
        FROM Users u
        LEFT JOIN PerformanceLogs pl ON u.id = pl.userId AND DATE(pl.timestamp) = ?
        WHERE pl.id IS NULL AND u.streak > 0
      `, [yesterdayStr]);

      // Reset their streaks
      if (inactiveUsers.length > 0) {
        const userIds = inactiveUsers.map(user => user.id);
        await pool.execute(`
          UPDATE Users 
          SET streak = 0 
          WHERE id IN (${userIds.map(() => '?').join(',')})
        `, userIds);
      }

      return inactiveUsers.length;
    } catch (error) {
      console.error('Error resetting streaks:', error);
      throw error;
    }
  }
}

module.exports = StreakService; 