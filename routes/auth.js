const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
