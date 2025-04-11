const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { errorResponse } = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return errorResponse(res, 'No authentication token, access denied', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = {
      id: user.id,
      isAdmin: user.isAdmin
    };
    next();
  } catch (error) {
    errorResponse(res, 'Token is not valid', 401);
  }
};

module.exports = auth; 