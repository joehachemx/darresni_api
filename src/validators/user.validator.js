const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  streak: Joi.number().integer().min(0).default(0),
  isAdmin: Joi.boolean().default(false)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  username: Joi.string().min(2).max(50)
}).min(1);

const changePasswordSchema = Joi.object({
  newPassword: Joi.string().required().min(6)
});

module.exports = {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
}; 