// In-memory database for simplicity (in production, use a real database)
const users = [];
const rooms = [];
const bookings = [];

// ID counters to avoid duplicate IDs
let userIdCounter = 1;
let bookingIdCounter = 1;

// Initialize with some sample rooms
rooms.push(
  { id: 1, number: '101', type: 'Single', price: 50, available: true },
  { id: 2, number: '102', type: 'Double', price: 80, available: true },
  { id: 3, number: '201', type: 'Suite', price: 150, available: true },
  { id: 4, number: '202', type: 'Double', price: 80, available: true },
  { id: 5, number: '301', type: 'Suite', price: 150, available: true }
);

const getNextUserId = () => userIdCounter++;
const getNextBookingId = () => bookingIdCounter++;

module.exports = {
  users,
  rooms,
  bookings,
  getNextUserId,
  getNextBookingId
};
