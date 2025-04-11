const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response');

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, dob } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      dob
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    successResponse(res, 'User registered successfully', { user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    errorResponse(res, 'Failed to register user', 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    successResponse(res, 'Login successful', { user, token });
  } catch (error) {
    console.error('Error logging in:', error);
    errorResponse(res, 'Failed to login', 500);
  }
};


module.exports = {
  registerUser,
  login
};
