const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled server error', { error: err.message, stack: err.stack });

  const statusCode = err.statusCode || 500;
  const originalText = req.body?.text || '';

  return res.status(statusCode).json({
    success: false,
    error: 'AI Processing Error',
    message: err.message || 'Unable to improve your text right now. Your original text has not been changed.',
    originalText
  });
};

const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Endpoint ${req.originalUrl} does not exist.`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
