const Joi = require('joi');

const createPerformanceLogSchema = Joi.object({
  userId: Joi.number().required(),
  exerciseId: Joi.number().required(),
  performance: Joi.number().min(0).max(100).required(),
  userInput: Joi.string().required(),
  correction: Joi.string().required()
});

module.exports = {
  createPerformanceLogSchema
}; 