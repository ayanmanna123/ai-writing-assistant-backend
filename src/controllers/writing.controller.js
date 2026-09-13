const WritingService = require('../services/writing.service');

const writingService = new WritingService();

const improveText = async (req, res, next) => {
  try {
    const { text, tone, creativity } = req.body;
    const result = await writingService.improve(text, { tone, creativity });
    return res.status(200).json({
      success: true,
      originalText: result.originalText,
      improvedText: result.improvedText,
      mode: result.mode
    });
  } catch (error) {
    next(error);
  }
};

const correctGrammar = async (req, res, next) => {
  try {
    const { text } = req.body;
    const result = await writingService.grammar(text);
    return res.status(200).json({
      success: true,
      originalText: result.originalText,
      improvedText: result.improvedText,
      mode: result.mode
    });
  } catch (error) {
    next(error);
  }
};

const rewriteText = async (req, res, next) => {
  try {
    const { text, mode, creativity } = req.body;
    const result = await writingService.rewrite(text, mode, { creativity });
    return res.status(200).json({
      success: true,
      originalText: result.originalText,
      improvedText: result.improvedText,
      mode: result.mode
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  improveText,
  correctGrammar,
  rewriteText
};
