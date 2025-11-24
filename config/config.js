require('dotenv').config();

// Validate required environment variables
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable must be set in production');
}

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_only_for_development',
  NODE_ENV: process.env.NODE_ENV || (process.env.JEST_WORKER_ID !== undefined ? 'test' : 'development')
};
