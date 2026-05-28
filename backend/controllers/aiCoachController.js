// controllers/aiCoachController.js

const hfService = require('../services/huggingFaceService');
const judgeService = require('../services/judgeService');
const evaluationService = require('../services/evaluationService');
const assessmentPrompts = require('../utils/assessmentPrompts');
const promptUtils = require('../utils/aiPromptUtils');
const asyncHandler = require('../utils/asyncHandler');
const safeJsonParse = require('../utils/safeJsonParse');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Generate comprehensive 7-question quiz for a given topic
 * @route   POST /api/coach/generate-questions
 * @access  Public
 */
const generateQuestions = asyncHandler(async (req, res, next) => {
    const { topic } = req.body;
    const enableJudge = process.env.ENABLE_JUDGE_MODE === 'true';

    // Generate comprehensive 7-question quiz
    // (2 fundamental, 2 practical, 2 advanced, 1 adaptive)
    const questionsPrompt = assessmentPrompts.createComprehensiveQuizPrompt(topic);
    const questionsResponseText = await hfService.invokeModel(questionsPrompt, 'quiz generation');
    const questionsData = safeJsonParse(questionsResponseText, 'quiz generation');

    // Validate the structure
    if (!questionsData || !Array.isArray(questionsData.questions) || questionsData.questions.length === 0) {
        throw new ApiError('The AI failed to generate valid quiz questions.', 500);
    }

    // Verify we have 7 questions
    if (questionsData.questions.length !== 7) {
        console.warn(`Expected 7 questions, got ${questionsData.questions.length}. Proceeding anyway.`);
    }

    let judgeValidation = null;

    // Optional judge verification
    if (enableJudge) {
        try {
            judgeValidation = await judgeService.verifyQuizQuality(topic, questionsData.questions);
        } catch (error) {
            console.warn('Judge verification failed, returning questions without validation:', error.message);
        }
    }

    res.status(200).json({
        success: true,
        data: {
            topic,
            total_questions: questionsData.questions.length,
            questions: questionsData.questions,
            ...(judgeValidation && { judgeValidation })
        }
    });
});

/**
 * @desc    Process learner's answers using semantic LLM evaluation
 * @route   POST /api/coach/evaluate
 * @access  Public
 */
const processEvaluation = asyncHandler(async (req, res, next) => {
    const { topic, answers, questions } = req.body;

    console.log('--- [CONTROLLER] Starting semantic evaluation ---');
    console.log(`Topic: ${topic}`);
    console.log(`Questions received: ${questions.length}`);
    console.log(`Answers received: ${answers.length}`);

    // Validate inputs
    if (!topic || !questions || !answers || questions.length === 0 || answers.length === 0) {
        throw new ApiError('Topic, questions, and answers are required', 400);
    }

    if (questions.length !== answers.length) {
        throw new ApiError('Number of questions must match number of answers', 400);
    }

    try {
        // CALL 1: Semantic evaluation using LLM
        // Evaluates across 5 dimensions: technical accuracy, depth, practical understanding, critical thinking, clarity
        console.log('[CONTROLLER] Calling evaluation service for semantic analysis...');
        const evaluation = await evaluationService.evaluateAnswersSemanticly(topic, questions, answers);

        // CALL 2: Generate personalized 60-day roadmap
        // Tailored to learner's score and identified weaknesses
        console.log('[CONTROLLER] Generating personalized 60-day roadmap...');
        const roadmap = await evaluationService.generatePersonalizedRoadmap(topic, evaluation);

        // CALL 3: Generate adaptive coaching message
        // Personalized feedback based on performance
        console.log('[CONTROLLER] Generating adaptive coaching message...');
        const coaching = await evaluationService.generateCoachingMessage(topic, evaluation);

        // Consolidate all evaluation data
        const consolidatedData = evaluationService.consolidateEvaluationData(evaluation, roadmap, coaching);

        console.log('[CONTROLLER] ✅ Evaluation complete');
        console.log(`  - Overall Score: ${evaluation.overall_score}`);
        console.log(`  - Skill Level: ${evaluation.skill_level}`);
        console.log(`  - Strengths: ${evaluation.strengths.join(', ')}`);
        console.log(`  - Weaknesses: ${evaluation.weaknesses.join(', ')}`);

        // Return comprehensive evaluation response (compatible with frontend)
        res.status(200).json({
            success: true,
            data: {
                analysis: {
                    score: evaluation.overall_score,
                    weak_topics: evaluation.weaknesses || evaluation.weak_topics || [],
                    strengths: evaluation.strengths || [],
                    summary: evaluation.notes || `Your understanding of ${topic} demonstrates ${evaluation.skill_level} level comprehension. Continue building on your strengths and addressing identified weaknesses through the roadmap.`
                },
                coaching: coaching,
                roadmap: roadmap,
                full_evaluation: evaluation,
                next_steps: [
                    'Review the personalized 60-day roadmap above',
                    'Focus on the identified weakness areas',
                    'Build projects aligned with your current skill level',
                    'Gradually progress through the phases'
                ]
            }
        });

    } catch (error) {
        console.error('[CONTROLLER] Error during evaluation:', error.message);
        throw error;
    }
});

module.exports = {
    generateQuestions,
    processEvaluation,
};
