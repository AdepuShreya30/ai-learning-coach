// services/evaluationService.js

const hfService = require('./huggingFaceService');
const assessmentPrompts = require('../utils/assessmentPrompts');
const safeJsonParse = require('../utils/safeJsonParse');
const ApiError = require('../utils/ApiError');

/**
 * Evaluates learner answers semantically using LLM across 5 dimensions
 * @param {string} topic - The learning topic
 * @param {Array} questions - Array of quiz questions with category
 * @param {Array} answers - Array of learner answers
 * @returns {Promise<Object>} Comprehensive evaluation with multi-dimensional scores
 */
const evaluateAnswersSemanticly = async (topic, questions, answers) => {
    console.log('--- [EVALUATION SERVICE] Starting semantic evaluation ---');

    // Validate inputs
    if (!topic || !questions || !answers) {
        throw new ApiError('Missing required parameters for evaluation', 400);
    }

    if (questions.length !== answers.length) {
        throw new ApiError('Number of questions must match number of answers', 400);
    }

    try {
        // Create semantic evaluation prompt
        const evaluationPrompt = assessmentPrompts.createSemanticEvaluationPrompt(
            topic,
            questions,
            answers
        );

        // Call LLM for semantic evaluation
        console.log('[EVALUATION SERVICE] Calling LLM for semantic evaluation...');
        const evaluationResponseText = await hfService.invokeModel(
            evaluationPrompt,
            'semantic evaluation'
        );

        // Parse and validate response
        const evaluation = safeJsonParse(evaluationResponseText, 'semantic evaluation');

        // Validate evaluation structure
        if (!evaluation || typeof evaluation.overall_score !== 'number') {
            throw new ApiError('LLM returned invalid evaluation structure', 502);
        }

        console.log('[EVALUATION SERVICE] ✅ Semantic evaluation complete');
        console.log(`  - Overall Score: ${evaluation.overall_score}`);
        console.log(`  - Skill Level: ${evaluation.skill_level}`);
        console.log(`  - Shallow answers detected: ${evaluation.shallow_answer_detected}`);
        console.log(`  - AI-generated response detected: ${evaluation.ai_generated_response_detected}`);

        // Post-process evaluation
        const processedEvaluation = processEvaluation(evaluation, topic);

        return processedEvaluation;

    } catch (error) {
        console.error('[EVALUATION SERVICE] Error during semantic evaluation:', error.message);
        throw error;
    }
};

/**
 * Post-processes evaluation to detect issues and consolidate scores
 * @param {Object} evaluation - Raw evaluation from LLM
 * @param {string} topic - The topic being evaluated
 * @returns {Object} Processed evaluation
 */
const processEvaluation = (evaluation, topic) => {
    console.log('[EVALUATION SERVICE] Processing evaluation results...');

    // Detect shallow answers
    const hasShallowAnswers = evaluation.shallow_answer_detected || false;
    if (hasShallowAnswers) {
        console.warn('[EVALUATION SERVICE] ⚠️ Shallow answers detected - may indicate insufficient effort');
        evaluation.assessment_notes = (evaluation.notes || '') + '\n[Note: Some answers appear surface-level]';
    }

    // Detect AI-generated responses
    const hasAIGenerated = evaluation.ai_generated_response_detected || false;
    if (hasAIGenerated) {
        console.warn('[EVALUATION SERVICE] ⚠️ AI-generated responses detected - reduce score confidence');
        evaluation.assessment_confidence = Math.max(evaluation.assessment_confidence * 0.8, 0.5);
    }

    // Ensure scores are in valid range
    evaluation.overall_score = Math.min(Math.max(evaluation.overall_score, 0), 100);
    evaluation.section_scores = {
        fundamentals: Math.min(Math.max(evaluation.section_scores?.fundamentals || 50, 0), 100),
        practical: Math.min(Math.max(evaluation.section_scores?.practical || 50, 0), 100),
        advanced: Math.min(Math.max(evaluation.section_scores?.advanced || 50, 0), 100)
    };

    // Consolidate weaknesses and strengths
    evaluation.strengths = evaluation.strengths || [];
    evaluation.weaknesses = evaluation.weaknesses || [];
    evaluation.missing_concepts = evaluation.missing_concepts || [];

    // Add topic context
    evaluation.topic = topic;

    console.log('[EVALUATION SERVICE] ✅ Evaluation processing complete');
    return evaluation;
};

/**
 * Generates personalized 60-day roadmap based on evaluation
 * @param {string} topic - The learning topic
 * @param {Object} evaluation - Evaluation results from semantic assessment
 * @returns {Promise<Object>} Detailed 60-day roadmap
 */
const generatePersonalizedRoadmap = async (topic, evaluation) => {
    console.log('--- [EVALUATION SERVICE] Generating personalized roadmap ---');

    try {
        // Create roadmap prompt
        const roadmapPrompt = assessmentPrompts.createDetailedRoadmapPrompt(topic, evaluation);

        // Call LLM for roadmap generation
        console.log('[EVALUATION SERVICE] Calling LLM for roadmap generation...');
        const roadmapResponseText = await hfService.invokeModel(
            roadmapPrompt,
            'personalized roadmap'
        );

        // Parse and validate response
        const roadmap = safeJsonParse(roadmapResponseText, 'personalized roadmap');

        if (!roadmap || !roadmap.phase_1) {
            throw new ApiError('LLM returned invalid roadmap structure', 502);
        }

        console.log('[EVALUATION SERVICE] ✅ Roadmap generation complete');
        return roadmap;

    } catch (error) {
        console.error('[EVALUATION SERVICE] Error during roadmap generation:', error.message);
        // Fall back to generic roadmap if LLM fails
        console.log('[EVALUATION SERVICE] Falling back to basic roadmap structure...');
        return generateBasicRoadmap(topic, evaluation);
    }
};

/**
 * Fallback basic roadmap when LLM generation fails
 */
const generateBasicRoadmap = (topic, evaluation) => {
    const { overall_score, weaknesses } = evaluation;

    return {
        duration_days: 60,
        skill_level_start: overall_score >= 80 ? 'advanced' : overall_score >= 60 ? 'intermediate' : 'developing',
        skill_level_end: 'advanced',
        personalization_notes: `Roadmap personalized for your current performance level (${overall_score}/100)`,
        phase_1: {
            title: 'Foundations & Basics (Days 1-15)',
            overview: `Master fundamental concepts of ${topic}`,
            objectives: [
                'Understand core concepts and terminology',
                'Set up development environment',
                'Complete foundational exercises'
            ],
            topics: ['Core concepts', 'Fundamentals', 'Setup and environment'],
            daily_breakdown: {
                days_1_3: 'Study fundamentals and take structured notes',
                days_4_7: 'Complete foundational exercises and coding challenges',
                days_8_11: 'Build a simple beginner project',
                days_12_15: 'Review weak areas and reinforce fundamentals'
            },
            projects: ['Beginner project', 'Simple utility application'],
            tools_and_tech: ['Primary tools', 'Development environment'],
            resources: ['Official documentation', 'Beginner tutorials'],
            checkpoint: 'Understand core concepts and complete beginner project'
        },
        phase_2: {
            title: 'Core Concepts & Practical Application (Days 16-30)',
            overview: `Deepen understanding with practical application of ${topic}`,
            objectives: [
                'Understand intermediate concepts',
                'Apply knowledge to real-world problems',
                'Build practical projects'
            ],
            topics: ['Intermediate concepts', 'Practical application', 'Best practices'],
            daily_breakdown: {
                days_16_20: 'Study intermediate concepts and case studies',
                days_21_25: 'Build medium-complexity project',
                days_26_30: 'Implement best practices'
            },
            projects: ['Medium project 1', 'Medium project 2'],
            tools_and_tech: ['Development tools', 'Testing frameworks'],
            resources: ['Technical documentation', 'Real-world examples'],
            checkpoint: 'Build functional projects and understand best practices'
        },
        phase_3: {
            title: 'Advanced Topics & Mastery (Days 31-45)',
            overview: `Develop expertise with advanced ${topic} concepts`,
            objectives: [
                'Master advanced patterns and techniques',
                'Build complex applications',
                'Optimize for production'
            ],
            topics: ['Advanced patterns', 'Performance optimization', 'Architecture'],
            daily_breakdown: {
                days_31_35: 'Study advanced concepts and patterns',
                days_36_40: 'Build complex application',
                days_41_45: 'Optimize and refactor for production'
            },
            projects: ['Advanced project 1', 'Advanced project 2'],
            tools_and_tech: ['Advanced frameworks', 'Performance tools'],
            resources: ['Advanced documentation', 'Research papers'],
            checkpoint: 'Understand advanced concepts and build scalable projects'
        },
        phase_4: {
            title: 'Mastery & Career Preparation (Days 46-60)',
            overview: `Build portfolio and prepare for professional work in ${topic}`,
            objectives: [
                'Create portfolio projects',
                'Contribute to open-source',
                'Prepare for technical interviews'
            ],
            topics: ['Portfolio development', 'Open-source', 'Interview preparation'],
            daily_breakdown: {
                days_46_50: 'Build comprehensive portfolio project',
                days_51_55: 'Contribute to open-source projects',
                days_56_60: 'Prepare for technical interviews'
            },
            projects: ['Portfolio project', 'Open-source contribution'],
            tools_and_tech: ['Version control', 'CI/CD tools'],
            resources: ['Interview guides', 'Portfolio examples'],
            checkpoint: 'Professional-ready skills and portfolio projects'
        },
        job_roles: {
            junior_developer: {
                title: 'Junior/Entry-level Developer',
                required_competencies: [
                    'Understand core concepts of ' + topic,
                    'Can build basic projects independently',
                    'Familiar with standard tools and frameworks',
                    'Can follow coding best practices'
                ],
                estimated_experience: '0-2 years'
            },
            mid_level: {
                title: 'Mid-level/Senior Developer',
                required_competencies: [
                    'Deep understanding of advanced concepts',
                    'Can architect solutions for complex problems',
                    'Understands performance and optimization',
                    'Can lead projects and mentor junior developers',
                    'Knowledge of design patterns and best practices'
                ],
                estimated_experience: '2-5 years'
            },
            senior_expert: {
                title: 'Senior/Expert Developer',
                required_competencies: [
                    'Expert-level mastery of all concepts',
                    'Can design scalable systems',
                    'Deep understanding of performance and security',
                    'Can make architectural decisions',
                    'Can mentor and lead teams',
                    'Contributes to open-source and community'
                ],
                estimated_experience: '5+ years'
            }
        },
        success_metrics: {
            week_2: 'Can explain core concepts and complete basic exercises',
            week_4: 'Completed at least 2 small projects',
            week_8: 'Built a functional medium-complexity application',
            week_12: 'Understand advanced patterns and best practices'
        },
        estimated_time_commitment: '1-2 hours per day',
        next_steps_after_60_days: [
            'Specialize in a specific area within ' + topic,
            'Start contributing to open-source projects',
            'Pursue specialized certifications',
            'Join communities and attend conferences',
            'Apply for positions requiring ' + topic + ' expertise'
        ]
    };
};

/**
 * Generates adaptive coaching message based on performance
 * @param {string} topic - The learning topic
 * @param {Object} evaluation - Evaluation results
 * @returns {Promise<string>} Personalized coaching message
 */
const generateCoachingMessage = async (topic, evaluation) => {
    console.log('--- [EVALUATION SERVICE] Generating coaching message ---');

    try {
        const coachingPrompt = assessmentPrompts.createAdaptiveCoachingPrompt(topic, evaluation);

        const coachingResponseText = await hfService.invokeModel(
            coachingPrompt,
            'adaptive coaching'
        );

        console.log('[EVALUATION SERVICE] ✅ Coaching message generated');
        return coachingResponseText;

    } catch (error) {
        console.error('[EVALUATION SERVICE] Error generating coaching message:', error.message);
        // Fallback coaching message
        return generateBasicCoachingMessage(topic, evaluation);
    }
};

/**
 * Fallback basic coaching message
 */
const generateBasicCoachingMessage = (topic, evaluation) => {
    const { overall_score, strengths, weaknesses } = evaluation;
    const level = overall_score >= 80 ? 'Advanced' : overall_score >= 60 ? 'Solid' : 'Developing';

    let message = `Great work on completing this ${topic} assessment!\n\n`;

    message += `Your Score: ${overall_score}/100 (${level} Understanding)\n\n`;

    if (strengths && strengths.length > 0) {
        message += `**Your Strengths:**\n`;
        strengths.forEach(s => message += `• ${s}\n`);
        message += '\nKeep building on these strong areas!\n\n';
    }

    if (weaknesses && weaknesses.length > 0) {
        message += `**Areas to Improve:**\n`;
        weaknesses.forEach(w => message += `• ${w}\n`);
        message += '\nFocus your learning on these areas to accelerate growth.\n\n';
    }

    message += `Review the personalized 60-day roadmap above - it's tailored to your current level and will help you systematically improve your ${topic} skills.`;

    return message;
};

/**
 * Consolidates all evaluation data into final response structure
 */
const consolidateEvaluationData = (evaluation, roadmap, coaching) => {
    return {
        analysis: evaluation,
        coaching: coaching,
        roadmap: roadmap,
        assessment_summary: {
            overall_score: evaluation.overall_score,
            skill_level: evaluation.skill_level,
            section_scores: evaluation.section_scores,
            confidence: evaluation.assessment_confidence
        }
    };
};

module.exports = {
    evaluateAnswersSemanticly,
    generatePersonalizedRoadmap,
    generateCoachingMessage,
    consolidateEvaluationData,
    processEvaluation,
};
