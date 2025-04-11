const { errorResponse } = require('../utils/response');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return errorResponse(res, error.details[0].message, 400);
  }
  next();
};

module.exports = validate; 