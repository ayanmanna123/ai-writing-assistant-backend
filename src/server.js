const app = require('./app');
const config = require('./config/environment');
const logger = require('./utils/logger');

const server = app.listen(config.port, '0.0.0.0', () => {
  logger.info(`AI Writing Assistant Backend server running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Health check endpoint: /api/v1/health`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
