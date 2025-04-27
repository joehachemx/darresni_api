const Joi = require('joi');

const signupSchema = Joi.object({
  firstName: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  phoneNumber: Joi.string().pattern(/^\+?[0-9\s\-()]{7,20}$/).required(),
  dob: Joi.date().required(),
  streak: Joi.number().integer().min(0).default(0),
  isAdmin: Joi.boolean().default(false)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
  dob: Joi.date()
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