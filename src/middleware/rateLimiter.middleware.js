const rateLimit = require('express-rate-limit');
const config = require('../config/environment');

const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please wait a few moments before trying again.'
  }
});

module.exports = {
  apiRateLimiter
};
