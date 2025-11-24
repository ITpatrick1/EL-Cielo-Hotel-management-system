const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  bookRoom,
  getUserBookings
} = require('../controllers/roomController');
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Public routes with rate limiting
router.get('/', apiLimiter, getAllRooms);
router.get('/available', apiLimiter, getAvailableRooms);
router.get('/:id', apiLimiter, getRoomById);

// Protected routes with rate limiting
router.post('/:id/book', authMiddleware, apiLimiter, bookRoom);
router.get('/bookings/my-bookings', authMiddleware, apiLimiter, getUserBookings);

module.exports = router;
