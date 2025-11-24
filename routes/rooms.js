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

// Public routes
router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);

// Protected routes
router.post('/:id/book', authMiddleware, bookRoom);
router.get('/bookings/my-bookings', authMiddleware, getUserBookings);

module.exports = router;
