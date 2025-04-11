const { errorResponse } = require('../utils/response');

const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return errorResponse(res, 'Admin access required', 403);
  }
  next();
};

module.exports = admin; 