const AIService = require('./ai.service');
const config = require('../config/environment');
const { WRITING_PROMPTS, WRITING_MODES } = require('../config/constants');
const logger = require('../utils/logger');

class GeminiProvider extends AIService {
  constructor() {
    super();
    this.apiKey = config.gemini.apiKey;
    this.modelName = config.gemini.model || 'gemini-2.5-flash';
    this.genAI = null;

    if (this.apiKey) {
      try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (err) {
        logger.warn('Failed to initialize @google/generative-ai SDK', { error: err.message });
      }
    } else {
      logger.warn('GEMINI_API_KEY is not set in environment variables.');
    }
  }

  /**
   * Process text using Google Gemini API
   * @param {string} text 
   * @param {string} mode 
   * @param {object} options 
   * @returns {Promise<string>}
   */
  async processText(text, mode = WRITING_MODES.IMPROVE, options = {}) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      return text;
    }

    const systemPrompt = WRITING_PROMPTS[mode] || WRITING_PROMPTS[WRITING_MODES.IMPROVE];
    const fullPrompt = `${systemPrompt}\n\nUser Input Text:\n"${text.trim()}"`;

    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is missing on backend server. Please configure GEMINI_API_KEY in .env file.');
    }

    try {
      if (this.genAI) {
        const model = this.genAI.getGenerativeModel({ model: this.modelName });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: options.creativity || 0.3,
            maxOutputTokens: 8192
          }
        });
        const response = await result.response;
        const textResult = response.text();
        if (textResult) {
          return this.cleanResponse(textResult);
        }
      }

      // Direct REST fallback
      const fetch = globalThis.fetch || require('node-fetch');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: options.creativity || 0.3, maxOutputTokens: 8192 }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || `Gemini API returned status ${res.status}`);
      }

      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        throw new Error('Gemini API returned empty response');
      }

      return this.cleanResponse(generatedText);
    } catch (error) {
      logger.error('Gemini Provider Error during text processing', { mode, error: error.message });
      throw error;
    }
  }

  cleanResponse(responseStr) {
    if (!responseStr) return '';
    let cleaned = responseStr.trim();

    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith('“') && cleaned.endsWith('”'))) {
      cleaned = cleaned.slice(1, -1).trim();
    }

    if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    }

    return cleaned;
  }
}

module.exports = GeminiProvider;
