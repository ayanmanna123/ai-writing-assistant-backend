/**
  * AIService Abstract Base Pattern
  * Standard interface for AI text processing across different LLM providers.
  */
class AIService {
  /**
   * Process text using specified mode & prompt
   * @param {string} text 
   * @param {string} mode 
   * @param {object} options 
   * @returns {Promise<string>}
   */
  async processText(text, mode, options = {}) {
    throw new Error('processText method must be implemented by AI Provider');
  }
}

module.exports = AIService;
