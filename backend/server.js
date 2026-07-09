const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const logger = require('./utils/logger');

// Connect to MongoDB
connectDB();

// Start express server
const server = app.listen(PORT, () => {
  logger.info(`BloodBridge AI Backend listening on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`);
  logger.warn('Shutting down server gracefully...');
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.warn('Shutting down server immediately...');
  process.exit(1);
});
