const Joi = require('joi');

const createExerciseSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(500),
  content: Joi.string().required(),
  difficulty: Joi.string().valid('1', '2', '3', '4', '5').required(),
  exo_type: Joi.string().required()
});

const updateExerciseSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(500),
  content: Joi.string(),
  difficulty: Joi.string().valid('1', '2', '3', '4', '5'),
  exo_type: Joi.string()
}).min(1);

module.exports = {
  createExerciseSchema,
  updateExerciseSchema
}; 