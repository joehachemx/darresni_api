const User = require('../models/user.model');
const Exercise = require('../models/exercise.model');
const PerformanceLog = require('../models/performanceLog.model');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalExercises,
      totalLogs,
      popularExercises,
      userRetention
    ] = await Promise.all([
      User.getTotalUsers(),
      User.getActiveUsers(),
      Exercise.getTotalExercises(),
      PerformanceLog.getTotalLogs(),
      PerformanceLog.getPopularExercises(),
      User.getUserRetention()
    ]);

    successResponse(res, 'Dashboard stats retrieved', {
      totalUsers,
      activeUsers,
      totalExercises,
      totalLogs,
      popularExercises,
      userRetention
    });
  } catch (error) {
    errorResponse(res, 'Failed to get dashboard stats', 500);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    successResponse(res, 'Users retrieved', users);
  } catch (error) {
    errorResponse(res, 'Failed to get users', 500);
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    await User.updateStatus(userId, isActive);
    successResponse(res, 'User status updated');
  } catch (error) {
    errorResponse(res, 'Failed to update user status', 500);
  }
};

const sendNotification = async (req, res) => {
  try {
    const { message, type } = req.body;
    await User.sendNotificationToAll(message, type);
    successResponse(res, 'Notification sent');
  } catch (error) {
    errorResponse(res, 'Failed to send notification', 500);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  sendNotification
}; 