const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, streak, isAdmin } = req.body;
    console.log('Attempting to register user:', { email, username });

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return errorResponse(res, 'User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed, attempting to create user...');
    
    const userId = await User.create({
      username,
      email,
      password: hashedPassword,
      streak,
      isAdmin
    });
    
    const user = await User.findById(userId);
    console.log('User created successfully with ID:', userId);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    successResponse(res, 'User registered successfully', { 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        streak: user.streak,
        isAdmin: user.isAdmin
      }, 
      token 
    });
  } catch (error) {
    console.error('Detailed error registering user:', error);
    console.error('Error stack:', error.stack);
    errorResponse(res, 'Failed to register user', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    successResponse(res, 'Login successful', { 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        streak: user.streak
      }, 
      token 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    errorResponse(res, 'Failed to login', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await User.updateProfile(userId, updateData);
    if (!updatedUser) {
      return errorResponse(res, 'User not found', 404);
    }

    successResponse(res, 'Profile updated successfully', updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    errorResponse(res, 'Failed to update profile', 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    await User.changePassword(userId, newPassword);
    successResponse(res, 'Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    errorResponse(res, 'Failed to change password', 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.delete(userId);
    successResponse(res, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    errorResponse(res, 'Failed to delete user', 500);
  }
};

module.exports = {
  registerUser,
  login,
  updateProfile,
  changePassword,
  deleteUser
};
