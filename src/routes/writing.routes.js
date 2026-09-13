const express = require('express');
const { improveText, correctGrammar, rewriteText } = require('../controllers/writing.controller');
const { validateImprove, validateGrammar, validateRewrite } = require('../middleware/validation.middleware');

const router = express.Router();

// POST /api/v1/writing/improve
router.post('/improve', validateImprove, improveText);

// POST /api/v1/writing/grammar
router.post('/grammar', validateGrammar, correctGrammar);

// POST /api/v1/writing/rewrite
router.post('/rewrite', validateRewrite, rewriteText);

module.exports = router;
