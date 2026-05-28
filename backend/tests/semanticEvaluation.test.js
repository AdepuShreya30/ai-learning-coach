// tests/semanticEvaluation.test.js

const evaluationService = require('../services/evaluationService');
const assessmentPrompts = require('../utils/assessmentPrompts');

// Mock HuggingFace service
jest.mock('../services/huggingFaceService', () => ({
    invokeModel: jest.fn(async (prompt, taskDescription) => {
        if (taskDescription === 'semantic evaluation') {
            return JSON.stringify({
                overall_score: 75,
                skill_level: 'intermediate',
                section_scores: {
                    fundamentals: 80,
                    practical: 75,
                    advanced: 70
                },
                question_analysis: [
                    {
                        question_id: 1,
                        technical_accuracy: 80,
                        depth_of_knowledge: 75,
                        practical_understanding: 70,
                        critical_thinking: 75,
                        clarity: 80,
                        feedback: 'Good understanding of fundamentals'
                    }
                ],
                strengths: ['Conceptual understanding', 'Clear communication'],
                weaknesses: ['Practical application', 'Advanced concepts'],
                missing_concepts: ['Design patterns', 'Performance optimization'],
                shallow_answer_detected: false,
                ai_generated_response_detected: false,
                assessment_confidence: 0.85,
                notes: 'Good foundation with room for advanced learning'
            });
        }

        if (taskDescription === 'personalized roadmap') {
            return JSON.stringify({
                duration_days: 60,
                skill_level_start: 'intermediate',
                skill_level_end: 'advanced',
                personalization_notes: 'Tailored for intermediate learner',
                phase_1: {
                    title: 'Foundations (Days 1-15)',
                    overview: 'Master fundamentals',
                    objectives: ['Learn basics'],
                    topics: ['Topic 1'],
                    daily_breakdown: {
                        days_1_3: 'Study basics',
                        days_4_7: 'Complete exercises',
                        days_8_11: 'Build project',
                        days_12_15: 'Review'
                    },
                    projects: ['Project 1'],
                    tools_and_tech: ['Tool 1'],
                    resources: ['Resource 1'],
                    checkpoint: 'Understand basics'
                },
                phase_2: {
                    title: 'Core Concepts (Days 16-30)',
                    overview: 'Deepen understanding',
                    objectives: ['Learn advanced concepts'],
                    topics: ['Topic 2'],
                    daily_breakdown: {},
                    projects: ['Project 2'],
                    tools_and_tech: ['Tool 2'],
                    resources: ['Resource 2'],
                    checkpoint: 'Build practical projects'
                },
                phase_3: {
                    title: 'Advanced (Days 31-45)',
                    overview: 'Master advanced topics',
                    objectives: ['Learn expert techniques'],
                    topics: ['Topic 3'],
                    daily_breakdown: {},
                    projects: ['Project 3'],
                    tools_and_tech: ['Tool 3'],
                    resources: ['Resource 3'],
                    checkpoint: 'Build scalable projects'
                },
                phase_4: {
                    title: 'Career Preparation (Days 46-60)',
                    overview: 'Prepare for professional work',
                    objectives: ['Build portfolio'],
                    topics: ['Topic 4'],
                    daily_breakdown: {},
                    projects: ['Portfolio project'],
                    tools_and_tech: ['Tool 4'],
                    resources: ['Resource 4'],
                    checkpoint: 'Professional-ready'
                },
                job_roles: {
                    junior_developer: {
                        title: 'Junior Developer',
                        required_competencies: ['Basic understanding'],
                        estimated_experience: '0-2 years'
                    },
                    mid_level: {
                        title: 'Mid-level Developer',
                        required_competencies: ['Deep understanding'],
                        estimated_experience: '2-5 years'
                    },
                    senior_expert: {
                        title: 'Senior Developer',
                        required_competencies: ['Expert level'],
                        estimated_experience: '5+ years'
                    }
                },
                success_metrics: {
                    week_2: 'Understand basics',
                    week_4: 'Complete projects',
                    week_8: 'Build applications',
                    week_12: 'Master concepts'
                },
                estimated_time_commitment: '1-2 hours per day',
                next_steps_after_60_days: ['Specialize', 'Contribute', 'Apply for jobs']
            });
        }

        if (taskDescription === 'adaptive coaching') {
            return 'Great work on your assessment! You showed solid understanding of the fundamentals and practical applications. Continue focusing on advanced concepts and design patterns. Your personalized 60-day roadmap above will guide you systematically through the next steps.';
        }

        return JSON.stringify({ default: 'mock response' });
    })
}));

describe('Semantic Evaluation Service', () => {
    describe('evaluateAnswersSemanticly', () => {
        it('should evaluate answers across 5 dimensions', async () => {
            const topic = 'JavaScript Closures';
            const questions = [
                { id: 1, category: 'fundamental', question: 'What is a closure?' },
                { id: 2, category: 'fundamental', question: 'How do closures relate to scope?' },
                { id: 3, category: 'practical', question: 'Provide a real-world example of closures' },
                { id: 4, category: 'practical', question: 'How would you use closures in a web application?' },
                { id: 5, category: 'advanced', question: 'Discuss closure performance implications' },
                { id: 6, category: 'advanced', question: 'Explain the relationship between closures and memory' },
                { id: 7, category: 'adaptive', question: 'Can you explain the event handler example?' }
            ];
            const answers = [
                'A closure is a function that has access to variables from its outer scope',
                'Closures give functions access to variables in their parent scope',
                'Event handlers in JavaScript use closures to maintain state',
                'You can use closures to create data privacy and encapsulation',
                'Closures can impact memory usage if not managed carefully',
                'Each closure maintains a reference to its parent scope variables',
                'Yes, the event handler creates a closure over the count variable'
            ];

            const evaluation = await evaluationService.evaluateAnswersSemanticly(topic, questions, answers);

            expect(evaluation).toBeDefined();
            expect(evaluation.overall_score).toBeGreaterThanOrEqual(0);
            expect(evaluation.overall_score).toBeLessThanOrEqual(100);
            expect(evaluation.skill_level).toMatch(/beginner|intermediate|advanced|expert/);
            expect(evaluation.section_scores).toBeDefined();
            expect(evaluation.section_scores.fundamentals).toBeGreaterThanOrEqual(0);
            expect(evaluation.section_scores.practical).toBeGreaterThanOrEqual(0);
            expect(evaluation.section_scores.advanced).toBeGreaterThanOrEqual(0);
            expect(Array.isArray(evaluation.question_analysis)).toBe(true);
            expect(Array.isArray(evaluation.strengths)).toBe(true);
            expect(Array.isArray(evaluation.weaknesses)).toBe(true);
            expect(Array.isArray(evaluation.missing_concepts)).toBe(true);
            expect(typeof evaluation.assessment_confidence).toBe('number');
        });

        it('should detect shallow answers', async () => {
            const topic = 'React Hooks';
            const questions = [
                { id: 1, category: 'fundamental', question: 'What are React hooks?' },
                { id: 2, category: 'fundamental', question: 'Name some common hooks' },
                { id: 3, category: 'practical', question: 'How would you use useState?' },
                { id: 4, category: 'practical', question: 'When would you use useEffect?' },
                { id: 5, category: 'advanced', question: 'Explain custom hooks' },
                { id: 6, category: 'advanced', question: 'Discuss hook dependencies' },
                { id: 7, category: 'adaptive', question: 'Can you explain the previous example?' }
            ];
            const answers = [
                'Hooks are functions',
                'useState, useEffect',
                'For state',
                'For side effects',
                'Functions that use hooks',
                'They control when effects run',
                'Yes'
            ];

            const evaluation = await evaluationService.evaluateAnswersSemanticly(topic, questions, answers);

            expect(evaluation).toBeDefined();
            expect(evaluation.shallow_answer_detected !== undefined).toBe(true);
        });

        it('should process evaluation correctly', async () => {
            const mockEvaluation = {
                overall_score: 75,
                skill_level: 'intermediate',
                section_scores: {
                    fundamentals: 80,
                    practical: 75,
                    advanced: 70
                },
                question_analysis: [],
                strengths: ['Understanding'],
                weaknesses: ['Application'],
                missing_concepts: [],
                assessment_confidence: 0.85,
                notes: 'Good work'
            };

            const processed = evaluationService.processEvaluation(mockEvaluation, 'Test Topic');

            expect(processed.overall_score).toBeLessThanOrEqual(100);
            expect(processed.overall_score).toBeGreaterThanOrEqual(0);
            expect(processed.topic).toBe('Test Topic');
            expect(processed.section_scores.fundamentals).toBeLessThanOrEqual(100);
        });
    });

    describe('generatePersonalizedRoadmap', () => {
        it('should generate 60-day roadmap for intermediate learner', async () => {
            const evaluation = {
                overall_score: 75,
                section_scores: { fundamentals: 80, practical: 75, advanced: 70 },
                weaknesses: ['Advanced patterns'],
                strengths: ['Fundamentals'],
                missing_concepts: ['Design patterns']
            };

            const roadmap = await evaluationService.generatePersonalizedRoadmap('JavaScript', evaluation);

            expect(roadmap).toBeDefined();
            expect(roadmap.duration_days).toBe(60);
            expect(roadmap.phase_1).toBeDefined();
            expect(roadmap.phase_2).toBeDefined();
            expect(roadmap.phase_3).toBeDefined();
            expect(roadmap.phase_4).toBeDefined();
            expect(roadmap.job_roles).toBeDefined();
            expect(roadmap.job_roles.junior_developer).toBeDefined();
            expect(roadmap.job_roles.mid_level).toBeDefined();
            expect(roadmap.job_roles.senior_expert).toBeDefined();
            expect(roadmap.success_metrics).toBeDefined();
        });

        it('should be weakness-aware', async () => {
            const evaluation = {
                overall_score: 45,
                section_scores: { fundamentals: 60, practical: 45, advanced: 20 },
                weaknesses: ['Async/await', 'Promises', 'Error handling'],
                strengths: ['Variables'],
                missing_concepts: ['Concurrency', 'Event loop']
            };

            const roadmap = await evaluationService.generatePersonalizedRoadmap('JavaScript', evaluation);

            expect(roadmap).toBeDefined();
            expect(roadmap.personalization_notes).toBeDefined();
            expect(roadmap.phase_1).toBeDefined();
        });

        it('should adapt to beginner learners', async () => {
            const evaluation = {
                overall_score: 35,
                section_scores: { fundamentals: 40, practical: 30, advanced: 20 },
                weaknesses: ['Everything'],
                strengths: [],
                missing_concepts: ['All concepts']
            };

            const roadmap = await evaluationService.generatePersonalizedRoadmap('Python', evaluation);

            expect(roadmap).toBeDefined();
            expect(roadmap.skill_level_start).toMatch(/beginner|developing/);
        });

        it('should adapt to advanced learners', async () => {
            const evaluation = {
                overall_score: 90,
                section_scores: { fundamentals: 95, practical: 90, advanced: 85 },
                weaknesses: [],
                strengths: ['Everything'],
                missing_concepts: []
            };

            const roadmap = await evaluationService.generatePersonalizedRoadmap('Docker', evaluation);

            expect(roadmap).toBeDefined();
            expect(roadmap.skill_level_start).toMatch(/advanced|expert/);
        });
    });

    describe('generateCoachingMessage', () => {
        it('should generate personalized coaching', async () => {
            const evaluation = {
                overall_score: 75,
                strengths: ['Good concepts', 'Clear thinking'],
                weaknesses: ['Application', 'Practice']
            };

            const coaching = await evaluationService.generateCoachingMessage('React', evaluation);

            expect(coaching).toBeDefined();
            expect(typeof coaching).toBe('string');
            expect(coaching.length).toBeGreaterThan(0);
        });
    });

    describe('Prompt Generation', () => {
        it('should create comprehensive quiz prompt', () => {
            const prompt = assessmentPrompts.createComprehensiveQuizPrompt('TypeScript');

            expect(prompt).toBeDefined();
            expect(prompt).toContain('7-question');
            expect(prompt).toContain('fundamental');
            expect(prompt).toContain('practical');
            expect(prompt).toContain('advanced');
            expect(prompt).toContain('TypeScript');
        });

        it('should create semantic evaluation prompt', () => {
            const questions = [
                { id: 1, category: 'fundamental', question: 'What is TypeScript?' },
                { id: 2, category: 'fundamental', question: 'Why use TypeScript?' }
            ];
            const answers = ['Answer 1', 'Answer 2'];

            const prompt = assessmentPrompts.createSemanticEvaluationPrompt('TypeScript', questions, answers);

            expect(prompt).toBeDefined();
            expect(prompt).toContain('5 dimensions');
            expect(prompt).toContain('Technical Accuracy');
            expect(prompt).toContain('Depth of Knowledge');
            expect(prompt).toContain('Practical Understanding');
            expect(prompt).toContain('Critical Thinking');
            expect(prompt).toContain('Clarity');
        });

        it('should create detailed roadmap prompt', () => {
            const analysis = {
                overall_score: 70,
                section_scores: { fundamentals: 75, practical: 70, advanced: 65 },
                weaknesses: ['Advanced patterns'],
                strengths: ['Basics'],
                missing_concepts: []
            };

            const prompt = assessmentPrompts.createDetailedRoadmapPrompt('Go', analysis);

            expect(prompt).toBeDefined();
            expect(prompt).toContain('60-day');
            expect(prompt).toContain('70');
            expect(prompt).toContain('Advanced patterns');
        });

        it('should create adaptive coaching prompt', () => {
            const analysis = {
                overall_score: 65,
                strengths: ['Understanding', 'Communication'],
                weaknesses: ['Application', 'Performance']
            };

            const prompt = assessmentPrompts.createAdaptiveCoachingPrompt('Rust', analysis);

            expect(prompt).toBeDefined();
            expect(prompt).toContain('supportive');
            expect(prompt).toContain('Understanding');
            expect(prompt).toContain('Application');
        });
    });

    describe('consolidateEvaluationData', () => {
        it('should consolidate all evaluation components', () => {
            const evaluation = {
                overall_score: 75,
                skill_level: 'intermediate',
                section_scores: { fundamentals: 80, practical: 75, advanced: 70 },
                strengths: ['Good'],
                weaknesses: ['Fair'],
                assessment_confidence: 0.85
            };
            const roadmap = { duration_days: 60, phase_1: {} };
            const coaching = 'Great job!';

            const consolidated = evaluationService.consolidateEvaluationData(evaluation, roadmap, coaching);

            expect(consolidated).toBeDefined();
            expect(consolidated.analysis).toBe(evaluation);
            expect(consolidated.roadmap).toBe(roadmap);
            expect(consolidated.coaching).toBe(coaching);
            expect(consolidated.assessment_summary).toBeDefined();
        });
    });
});
