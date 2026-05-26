// services/judgeService.js

const hfService = require('./huggingFaceService');
const promptUtils = require('../utils/aiPromptUtils');
const safeJsonParse = require('../utils/safeJsonParse');
const ApiError = require('../utils/ApiError');

/**
 * Verifies the quality of generated quiz questions using an LLM judge.
 * @param {string} topic - The learning topic.
 * @param {Array} questions - The generated quiz questions.
 * @returns {Promise<Object>} Quality assessment with difficulty_level, is_well_formed, and feedback.
 */
const verifyQuizQuality = async (topic, questions) => {
    console.log('--- Judge: Verifying quiz quality ---');

    const prompt = promptUtils.createQuizQualityPrompt(topic, questions);
    const responseText = await hfService.invokeModel(prompt, 'judge: quiz quality');
    const qualityData = safeJsonParse(responseText, 'judge: quiz quality');

    // Validate the structure
    if (!qualityData || typeof qualityData.is_well_formed !== 'boolean') {
        throw new ApiError('Judge failed to provide valid quality assessment.', 500);
    }

    return {
        difficulty_level: qualityData.difficulty_level || 'medium',
        is_well_formed: qualityData.is_well_formed,
        feedback: qualityData.feedback || '',
        confidence: qualityData.confidence || 0.8
    };
};

/**
 * Enhances the analysis of learner answers using an LLM judge.
 * @param {string} topic - The learning topic.
 * @param {Array} questions - The quiz questions.
 * @param {Array} answers - The learner's answers.
 * @param {Object} initialAnalysis - The initial analysis from the first LLM call.
 * @returns {Promise<Object>} Enhanced analysis with judge validation.
 */
const enhanceAnswerAnalysis = async (topic, questions, answers, initialAnalysis) => {
    console.log('--- Judge: Enhancing answer analysis ---');

    const prompt = promptUtils.createAnalysisValidationPrompt(topic, questions, answers, initialAnalysis);
    const responseText = await hfService.invokeModel(prompt, 'judge: analysis validation');
    const enhancedData = safeJsonParse(responseText, 'judge: analysis validation');

    // Validate the structure
    if (!enhancedData || typeof enhancedData.adjusted_score !== 'number') {
        throw new ApiError('Judge failed to provide enhanced analysis.', 500);
    }

    return {
        adjusted_score: enhancedData.adjusted_score,
        confidence_level: enhancedData.confidence_level || 0.8,
        suggested_adjustments: enhancedData.suggested_adjustments || [],
        judge_notes: enhancedData.judge_notes || '',
        validates_initial_analysis: enhancedData.validates_initial_analysis !== false
    };
};

module.exports = {
    verifyQuizQuality,
    enhanceAnswerAnalysis,
};
