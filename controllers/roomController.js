const { rooms, bookings, getNextBookingId } = require('../models/database');

// Get all rooms
const getAllRooms = (req, res) => {
  res.json({ rooms });
};

// Get available rooms
const getAvailableRooms = (req, res) => {
  const availableRooms = rooms.filter(room => room.available);
  res.json({ rooms: availableRooms });
};

// Get room by ID
const getRoomById = (req, res) => {
  const room = rooms.find(r => r.id === parseInt(req.params.id));
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({ room });
};

// Book a room
const bookRoom = (req, res) => {
  const roomId = parseInt(req.params.id);
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (!room.available) {
    return res.status(400).json({ error: 'Room is not available' });
  }

  // Create booking
  const booking = {
    id: getNextBookingId(),
    roomId: room.id,
    userId: req.user.id,
    checkIn: req.body.checkIn || new Date().toISOString(),
    checkOut: req.body.checkOut,
    status: 'confirmed',
    createdAt: new Date()
  };

  bookings.push(booking);
  room.available = false;

  res.status(201).json({
    message: 'Room booked successfully',
    booking
  });
};

// Get user's bookings
const getUserBookings = (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.user.id);
  res.json({ bookings: userBookings });
};

module.exports = {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  bookRoom,
  getUserBookings
};
