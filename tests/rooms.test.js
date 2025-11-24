const request = require('supertest');
const app = require('../server');
const { users, rooms, bookings } = require('../models/database');

describe('Rooms API', () => {
  let token;

  beforeEach(async () => {
    // Clear data
    users.length = 0;
    bookings.length = 0;

    // Register and login a user
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'roomuser',
        email: 'room@example.com',
        password: 'password123'
      });
    token = response.body.token;

    // Reset room availability
    rooms.forEach(room => room.available = true);
  });

  describe('GET /api/rooms', () => {
    it('should get all rooms', async () => {
      const response = await request(app)
        .get('/api/rooms');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('rooms');
      expect(Array.isArray(response.body.rooms)).toBe(true);
      expect(response.body.rooms.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/rooms/available', () => {
    it('should get available rooms only', async () => {
      const response = await request(app)
        .get('/api/rooms/available');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('rooms');
      expect(Array.isArray(response.body.rooms)).toBe(true);
      response.body.rooms.forEach(room => {
        expect(room.available).toBe(true);
      });
    });
  });

  describe('GET /api/rooms/:id', () => {
    it('should get a specific room by ID', async () => {
      const response = await request(app)
        .get('/api/rooms/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('room');
      expect(response.body.room).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent room', async () => {
      const response = await request(app)
        .get('/api/rooms/9999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Room not found');
    });
  });

  describe('POST /api/rooms/:id/book', () => {
    it('should book a room with valid authentication', async () => {
      const response = await request(app)
        .post('/api/rooms/1/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          checkIn: '2025-12-01',
          checkOut: '2025-12-05'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Room booked successfully');
      expect(response.body).toHaveProperty('booking');
      expect(response.body.booking).toHaveProperty('roomId', 1);
    });

    it('should reject booking without authentication', async () => {
      const response = await request(app)
        .post('/api/rooms/1/book')
        .send({
          checkIn: '2025-12-01',
          checkOut: '2025-12-05'
        });

      expect(response.status).toBe(401);
    });

    it('should reject booking unavailable room', async () => {
      // Book the room first
      await request(app)
        .post('/api/rooms/1/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          checkIn: '2025-12-01',
          checkOut: '2025-12-05'
        });

      // Try to book again
      const response = await request(app)
        .post('/api/rooms/1/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          checkIn: '2025-12-06',
          checkOut: '2025-12-10'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Room is not available');
    });
  });

  describe('GET /api/rooms/bookings/my-bookings', () => {
    it('should get user bookings with authentication', async () => {
      // Book a room first
      await request(app)
        .post('/api/rooms/1/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          checkIn: '2025-12-01',
          checkOut: '2025-12-05'
        });

      const response = await request(app)
        .get('/api/rooms/bookings/my-bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('bookings');
      expect(Array.isArray(response.body.bookings)).toBe(true);
      expect(response.body.bookings.length).toBe(1);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/rooms/bookings/my-bookings');

      expect(response.status).toBe(401);
    });
  });
});
