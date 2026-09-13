const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/environment');
const writingRoutes = require('./routes/writing.routes');
const { apiRateLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const app = express();

// Trust proxy for reverse proxy platforms like Render
app.set('trust proxy', 1);

// Security and CORS middlewares
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiting
app.use('/api', apiRateLimiter);

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ai-writing-assistant-backend',
    version: '1.0.0',
    geminiConfigured: Boolean(config.gemini.apiKey)
  });
});

// API Routes
app.use('/api/v1/writing', writingRoutes);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
