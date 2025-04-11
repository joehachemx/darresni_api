const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  login, 
  updateProfile,
  changePassword,
  deleteUser
} = require('../controllers/user.controller');
const { 
  signupSchema, 
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
} = require('../validators/user.validator');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');
const owner = require('../middlewares/owner.middleware');

// Public routes
router.post('/signup', validate(signupSchema), registerUser);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.use(auth);

// User can only update/delete their own profile unless they're admin
router.put('/:userId', owner, validate(updateProfileSchema), updateProfile);
router.put('/:userId/password', owner, validate(changePasswordSchema), changePassword);
router.delete('/:userId', owner, deleteUser);

module.exports = router;