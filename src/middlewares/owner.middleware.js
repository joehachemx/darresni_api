const { errorResponse } = require('../utils/response');

const owner = (req, res, next) => {
  const { userId } = req.params;
  
  if (req.user.isAdmin || req.user.id === parseInt(userId)) {
    next();
  } else {
    errorResponse(res, 'Unauthorized access', 403);
  }
};

module.exports = owner; 