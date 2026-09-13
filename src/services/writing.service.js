const GeminiProvider = require('./gemini.provider');
const { WRITING_MODES } = require('../config/constants');
const logger = require('../utils/logger');

class WritingService {
  constructor(aiService = null) {
    this.aiService = aiService || new GeminiProvider();
  }

  async improve(text, options = {}) {
    logger.info('Executing text improvement request', { mode: WRITING_MODES.IMPROVE });
    const improvedText = await this.aiService.processText(text, WRITING_MODES.IMPROVE, options);
    return {
      originalText: text,
      improvedText,
      mode: WRITING_MODES.IMPROVE
    };
  }

  async grammar(text, options = {}) {
    logger.info('Executing grammar correction request', { mode: WRITING_MODES.GRAMMAR });
    const improvedText = await this.aiService.processText(text, WRITING_MODES.GRAMMAR, options);
    return {
      originalText: text,
      improvedText,
      mode: WRITING_MODES.GRAMMAR
    };
  }

  async rewrite(text, mode = WRITING_MODES.PROFESSIONAL, options = {}) {
    const validMode = Object.values(WRITING_MODES).includes(mode) ? mode : WRITING_MODES.IMPROVE;
    logger.info('Executing text rewrite request', { mode: validMode });
    const improvedText = await this.aiService.processText(text, validMode, options);
    return {
      originalText: text,
      improvedText,
      mode: validMode
    };
  }
}

module.exports = WritingService;
