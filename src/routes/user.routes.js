const express = require('express');
const router = express.Router();
const { registerUser, login } = require('../controllers/user.controller');
const { signupSchema, loginSchema } = require('../validators/user.validator');
const validate = require('../middlewares/validate.middleware');

router.post('/signup', validate(signupSchema), registerUser);
router.post('/login', validate(loginSchema), login);

module.exports = router;