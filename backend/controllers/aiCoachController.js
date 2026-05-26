// controllers/aiCoachController.js

const hfService = require('../services/huggingFaceService');
const judgeService = require('../services/judgeService');
const promptUtils = require('../utils/aiPromptUtils');
const asyncHandler = require('../utils/asyncHandler');
const safeJsonParse = require('../utils/safeJsonParse');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Generate quiz questions for a given topic
 * @route   POST /api/coach/generate-questions
 * @access  Public
 */
const generateQuestions = asyncHandler(async (req, res, next) => {
    const { topic } = req.body;
    const enableJudge = process.env.ENABLE_JUDGE_MODE === 'true';

    // --- CALL 0: Generate quiz questions ---
    const questionsPrompt = promptUtils.createQuizGenerationPrompt(topic);
    const questionsResponseText = await hfService.invokeModel(questionsPrompt, 'quiz generation');
    const questionsData = safeJsonParse(questionsResponseText, 'quiz generation');

    // Validate the structure
    if (!questionsData || !Array.isArray(questionsData.questions) || questionsData.questions.length === 0) {
        throw new ApiError('The AI failed to generate valid quiz questions.', 500);
    }

    let judgeValidation = null;

    // --- OPTIONAL CALL 1: Judge verifies quiz quality ---
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
            questions: questionsData.questions,
            ...(judgeValidation && { judgeValidation })
        }
    });
});

/**
 * @desc    Process learner's answers and generate a full coaching response
 * @route   POST /api/coach/evaluate
 * @access  Public
 */
const processEvaluation = asyncHandler(async (req, res, next) => {
    const { topic, answers, questions } = req.body;
    const enableJudge = process.env.ENABLE_JUDGE_MODE === 'true';

    // --- CALL 1: Analyze learner answers ---
    const analysisPrompt = promptUtils.createAnalysisPrompt(topic, questions, answers);
    const analysisResponseText = await hfService.invokeModel(analysisPrompt, 'learner analysis');
    const analysis = safeJsonParse(analysisResponseText, 'learner analysis');

    // Validate the structure of the analysis object
    if (!analysis || typeof analysis.score !== 'number' || !Array.isArray(analysis.weak_topics)) {
        throw new ApiError('The AI returned an invalid analysis object.', 500);
    }

    let enhancedAnalysis = null;

    // --- OPTIONAL CALL 2: Judge enhances answer analysis ---
    if (enableJudge) {
        try {
            enhancedAnalysis = await judgeService.enhanceAnswerAnalysis(topic, questions, answers, analysis);
        } catch (error) {
            console.warn('Judge enhancement failed, using initial analysis:', error.message);
        }
    }

    // Use judge's adjusted score if available and confident, otherwise use initial score
    const finalScore = enhancedAnalysis && enhancedAnalysis.validates_initial_analysis
        ? enhancedAnalysis.adjusted_score
        : analysis.score;

    let coachingResponseText;
    // --- CALL 3: Generate coaching based on score ---
    if (finalScore < 50) {
        // Generate beginner-friendly explanations
        if (analysis.weak_topics.length > 0) {
            const beginnerPrompt = promptUtils.createBeginnerExplanationPrompt(topic, analysis.weak_topics);
            coachingResponseText = await hfService.invokeModel(beginnerPrompt, 'beginner explanation');
        } else {
            coachingResponseText = "It looks like you're having some trouble. Let's review the basics of the topic together.";
        }
    } else {
        // Generate advanced challenge problems
        if (Array.isArray(analysis.strengths) && analysis.strengths.length > 0) {
            const advancedPrompt = promptUtils.createAdvancedChallengePrompt(topic, analysis.strengths);
            coachingResponseText = await hfService.invokeModel(advancedPrompt, 'advanced challenge');
        } else {
            coachingResponseText = "Great job! You have a solid understanding. Try applying what you've learned to a small project.";
        }
    }

    // --- CALL 4: Generate personalized 7-day learning roadmap ---
    const roadmapPrompt = promptUtils.createRoadmapPrompt(topic, analysis);
    const roadmapResponseText = await hfService.invokeModel(roadmapPrompt, 'learning roadmap');

    // --- Final Response ---
    res.status(200).json({
        success: true,
        data: {
            analysis: {
                ...analysis,
                score: finalScore
            },
            ...(enhancedAnalysis && { judgeEnhancement: enhancedAnalysis }),
            coaching: coachingResponseText,
            roadmap: roadmapResponseText,
        }
    });
});

module.exports = {
    generateQuestions,
    processEvaluation,
};
