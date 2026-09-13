const config = require('../config/environment');

const logger = {
  info: (message, meta = {}) => {
    // Ensure user text payloads are never logged
    const { text, prompt, ...safeMeta } = meta;
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, Object.keys(safeMeta).length ? safeMeta : '');
  },
  error: (message, meta = {}) => {
    const { text, prompt, ...safeMeta } = meta;
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, Object.keys(safeMeta).length ? safeMeta : '');
  },
  warn: (message, meta = {}) => {
    const { text, prompt, ...safeMeta } = meta;
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, Object.keys(safeMeta).length ? safeMeta : '');
  }
};

module.exports = logger;
