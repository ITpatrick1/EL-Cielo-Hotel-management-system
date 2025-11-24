const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to El Cielo Hotel Management System API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requires authentication)'
      },
      rooms: {
        getAllRooms: 'GET /api/rooms',
        getAvailableRooms: 'GET /api/rooms/available',
        getRoomById: 'GET /api/rooms/:id',
        bookRoom: 'POST /api/rooms/:id/book (requires authentication)',
        getUserBookings: 'GET /api/rooms/bookings/my-bookings (requires authentication)'
      }
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
