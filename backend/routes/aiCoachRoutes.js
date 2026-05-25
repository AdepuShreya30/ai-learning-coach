// routes/aiCoachRoutes.js

const express = require('express');
const aiCoachController = require('../controllers/aiCoachController');
const { evaluateValidationRules, validate, generateQuestionsValidationRules } = require('../middleware/validator');

const router = express.Router();

// POST /api/coach/generate-questions
// Generate quiz questions for a given topic
router.post(
    '/generate-questions',
    generateQuestionsValidationRules(),
    validate,
    aiCoachController.generateQuestions
);

// POST /api/coach/evaluate
// Analyze learner answers and provide coaching
router.post(
    '/evaluate',
    evaluateValidationRules(),
    validate,
    aiCoachController.processEvaluation
);

module.exports = router;
