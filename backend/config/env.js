const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/bloodbridge',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY || '',
  FIREBASE_SERVER_KEY: process.env.FIREBASE_SERVER_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
