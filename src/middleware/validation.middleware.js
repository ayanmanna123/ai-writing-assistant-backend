const { z } = require('zod');
const { WRITING_MODES } = require('../config/constants');

const improveSchema = z.object({
  text: z.string({
    required_error: 'Text field is required'
  }).min(1, 'Text cannot be empty').max(5000, 'Text exceeds maximum length of 5000 characters'),
  tone: z.string().optional().default('natural'),
  creativity: z.number().min(0).max(1).optional().default(0.3)
});

const grammarSchema = z.object({
  text: z.string({
    required_error: 'Text field is required'
  }).min(1, 'Text cannot be empty').max(5000, 'Text exceeds maximum length of 5000 characters')
});

const rewriteSchema = z.object({
  text: z.string({
    required_error: 'Text field is required'
  }).min(1, 'Text cannot be empty').max(5000, 'Text exceeds maximum length of 5000 characters'),
  mode: z.enum([
    WRITING_MODES.IMPROVE,
    WRITING_MODES.GRAMMAR,
    WRITING_MODES.PROFESSIONAL,
    WRITING_MODES.FRIENDLY,
    WRITING_MODES.CASUAL,
    WRITING_MODES.SHORTEN,
    WRITING_MODES.EXPAND
  ], {
    invalid_type_error: 'Invalid rewrite mode specified'
  }).default(WRITING_MODES.PROFESSIONAL),
  creativity: z.number().min(0).max(1).optional().default(0.3)
});

const validateBody = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issue = error.issues[0];
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid request payload'
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Invalid Request',
      message: 'Failed to parse request body'
    });
  }
};

module.exports = {
  validateImprove: validateBody(improveSchema),
  validateGrammar: validateBody(grammarSchema),
  validateRewrite: validateBody(rewriteSchema)
};
