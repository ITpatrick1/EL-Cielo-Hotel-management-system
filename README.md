# EL Cielo Hotel Management System

The closest full-service hotel (rooms, restaurant, ballroom, and swimming pool) to Bishenyi Bus Station and Rwanda Charity Eye Hospital—ideal for business travellers, medical visitors, weekenders, and local events.

## Features

- **Professional Frontend**: Modern, responsive web interface with animated gradient background
- **User Authentication**: Secure registration and login system with JWT tokens
- **Room Management**: Browse available rooms and view room details
- **Booking System**: Book rooms with authentication
- **User Profiles**: Manage user profiles and view booking history
- **RESTful API**: Clean and well-documented API endpoints
- **Contact Page**: Professional contact form with hotel information

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ITpatrick1/EL-Cielo-Hotel-management-system.git
cd EL-Cielo-Hotel-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3000
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
```

5. Start the server:
```bash
npm start
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

You'll see the professional frontend with animated background. The API is also accessible at `/api` endpoints.

For development with auto-reload:
```bash
npm run dev
```

## Frontend Features

The application includes a professional, modern frontend with:

- **Animated Gradient Background**: Smoothly shifting gradient colors with floating animated shapes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Navigation**: Smooth scrolling and mobile-friendly hamburger menu
- **Landing Page**: Showcases hotel amenities and available rooms
- **Contact Page**: Professional contact form with hotel information
- **Modal Authentication**: Login and registration forms in elegant modals
- **Room Booking**: Interactive booking system integrated with the backend API
- **Professional Animations**: Smooth transitions, hover effects, and loading states

### Pages

- **Home** (`index.html`): Main landing page with hero section, amenities, and room listings
- **Contact** (`contact.html`): Contact form and hotel information with the same animated background

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

### Rooms

#### Get All Rooms
```http
GET /api/rooms
```

#### Get Available Rooms
```http
GET /api/rooms/available
```

#### Get Room by ID
```http
GET /api/rooms/:id
```

#### Book a Room (Protected)
```http
POST /api/rooms/:id/book
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "checkIn": "2025-12-01",
  "checkOut": "2025-12-05"
}
```

#### Get User Bookings (Protected)
```http
GET /api/rooms/bookings/my-bookings
Authorization: Bearer <your-jwt-token>
```

## Testing

Run the test suite:
```bash
npm test
```

## Project Structure

```
EL-Cielo-Hotel-management-system/
├── public/                # Frontend files
│   ├── index.html        # Main landing page
│   ├── contact.html      # Contact page
│   ├── css/
│   │   └── style.css     # Styles with animated background
│   └── js/
│       └── main.js       # Frontend JavaScript
├── controllers/           # Request handlers
│   ├── authController.js
│   └── roomController.js
├── middleware/            # Custom middleware
│   ├── auth.js
│   └── rateLimiter.js
├── models/                # Data models
│   ├── database.js
│   ├── User.js
│   └── Room.js
├── routes/                # API routes
│   ├── auth.js
│   └── rooms.js
├── tests/                 # Test files
│   ├── auth.test.js
│   └── rooms.test.js
├── .env.example           # Environment variables example
├── .gitignore
├── package.json
├── server.js              # Application entry point
└── README.md
```

## Security

- Passwords are hashed using bcryptjs before storage
- JWT tokens are used for authentication
- Input validation on all endpoints
- Protected routes require valid authentication tokens
- Rate limiting to prevent brute force attacks:
  - Authentication endpoints: 5 requests per 15 minutes per IP
  - General API endpoints: 100 requests per 15 minutes per IP

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the ISC License.
