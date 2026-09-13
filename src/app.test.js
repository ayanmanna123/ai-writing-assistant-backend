const request = require('supertest');
const app = require('./app');

describe('AI Writing Assistant Backend API Endpoints', () => {
  describe('GET /api/v1/health', () => {
    it('should return 200 status and health payload', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('ai-writing-assistant-backend');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/v1/writing/improve', () => {
    it('should reject request with empty text with 400 Bad Request', async () => {
      const response = await request(app)
        .post('/api/v1/writing/improve')
        .send({ text: '' });
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
    });

    it('should reject request missing text field with 400 Bad Request', async () => {
      const response = await request(app)
        .post('/api/v1/writing/improve')
        .send({});
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/writing/rewrite', () => {
    it('should reject invalid mode with 400 Bad Request', async () => {
      const response = await request(app)
        .post('/api/v1/writing/rewrite')
        .send({ text: 'Hello world', mode: 'invalid_mode_name' });
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/api/v1/nonexistent');
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Not Found');
    });
  });
});
