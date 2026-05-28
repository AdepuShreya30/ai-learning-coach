// utils/assessmentPrompts.js

/**
 * Comprehensive 7-question quiz prompt with domain-specific questions
 * Questions cover: 2 fundamental, 2 practical, 2 advanced, 1 adaptive
 */
const createComprehensiveQuizPrompt = (topic) => {
    return `[INST] You are an expert curriculum designer creating a comprehensive assessment for "${topic}".

Create a 7-question quiz that thoroughly assesses understanding across different levels:

**Question Categories:**
- Questions 1-2: FUNDAMENTAL (basic concepts, definitions, core principles)
- Questions 3-4: PRACTICAL (real-world application, hands-on scenarios)
- Questions 5-6: ADVANCED (critical thinking, design decisions, architecture)
- Question 7: ADAPTIVE (follow-up to probe deeper understanding)

**Requirements:**
- Each question must be clear, specific, and unambiguous
- Questions should be domain-specific (use technical terminology)
- Avoid yes/no questions - ask for explanations
- Questions should require 2-5 minute answers
- Progressive difficulty from Q1 to Q7

Return ONLY a valid JSON object with no additional text:
{
  "questions": [
    {
      "id": 1,
      "category": "fundamental",
      "question": "question text here"
    },
    {
      "id": 2,
      "category": "fundamental",
      "question": "question text here"
    },
    {
      "id": 3,
      "category": "practical",
      "question": "question text here"
    },
    {
      "id": 4,
      "category": "practical",
      "question": "question text here"
    },
    {
      "id": 5,
      "category": "advanced",
      "question": "question text here"
    },
    {
      "id": 6,
      "category": "advanced",
      "question": "question text here"
    },
    {
      "id": 7,
      "category": "adaptive",
      "question": "question text here"
    }
  ]
}
[/INST]`;
};

/**
 * Semantic evaluation prompt - evaluates answers across 5 dimensions
 * No keyword matching, pure semantic understanding assessment
 */
const createSemanticEvaluationPrompt = (topic, questions, answers) => {
    const qaFormat = questions
        .map((q, idx) => `Q${idx + 1} [${q.category || 'assessment'}]: ${q.question}\nAnswer: ${answers[idx]}`)
        .join('\n\n');

    return `[INST] You are an expert AI assessor evaluating a learner's understanding of "${topic}".

Your task: Analyze these answers semantically (by MEANING, not keywords). Evaluate across 5 dimensions.

Quiz Responses:
${qaFormat}

**EVALUATION CRITERIA (Score each 0-100):**

1. **Technical Accuracy**: Is the answer factually correct? Does it demonstrate accurate understanding of concepts?
   - 80-100: Completely accurate, demonstrates deep understanding
   - 60-79: Mostly accurate with minor gaps
   - 40-59: Partially correct, some misunderstandings
   - 0-39: Significantly inaccurate or missing key concepts

2. **Depth of Knowledge**: How thoroughly does the answer explore the topic? Does it go beyond surface level?
   - 80-100: Explores nuances, relationships, and interconnections
   - 60-79: Good depth with multiple concepts covered
   - 40-59: Basic understanding with limited depth
   - 0-39: Surface-level or shallow explanations

3. **Practical Understanding**: Can the learner apply this knowledge? Are there concrete examples or applications?
   - 80-100: Clear real-world examples, practical applications demonstrated
   - 60-79: Good application with some concrete examples
   - 40-59: Limited application, few examples
   - 0-39: No practical application or examples

4. **Critical Thinking**: Does the answer show reasoning, analysis, or consideration of trade-offs?
   - 80-100: Analyzes problems, considers alternatives, discusses trade-offs
   - 60-79: Shows some analysis and reasoning
   - 40-59: Limited critical thinking, mostly factual
   - 0-39: No analysis or reasoning

5. **Clarity & Communication**: Is the answer well-structured and easy to understand?
   - 80-100: Excellently organized, clear logic flow, easy to follow
   - 60-79: Well-organized with clear explanations
   - 40-59: Somewhat unclear or poorly organized
   - 0-39: Unclear, disorganized, hard to understand

**RED FLAGS** (penalize):
- Generic AI-generated responses (too polished, lacks personal voice)
- Keyword stuffing (repetition without meaning)
- Vague or hand-wavy explanations
- Contradictory statements
- Copy-pasted content

**REWARDS** (bonus points):
- Original examples from learner's experience
- Discussion of performance, scalability, security
- Architectural thinking for design questions
- Understanding of trade-offs and limitations
- Connection to broader concepts

**ANALYSIS TASK:**
For each question, provide:
1. Scores across 5 dimensions
2. Specific feedback (what they did well, what to improve)
3. Identify key strengths in the answers
4. Identify key weaknesses/missing concepts
5. Adaptive question suggestion (only for Q7 analysis)

Return ONLY valid JSON with no additional text:
{
  "overall_score": number (0-100, average of all dimensions across all answers),
  "skill_level": "beginner|intermediate|advanced|expert",
  "section_scores": {
    "fundamentals": number (average of Q1-Q2 scores),
    "practical": number (average of Q3-Q4 scores),
    "advanced": number (average of Q5-Q6 scores)
  },
  "question_analysis": [
    {
      "question_id": 1,
      "question": "question text",
      "category": "fundamental",
      "technical_accuracy": number,
      "depth_of_knowledge": number,
      "practical_understanding": number,
      "critical_thinking": number,
      "clarity": number,
      "dimension_scores_explanation": "brief explanation of scores",
      "feedback": "specific, actionable feedback on this answer"
    },
    ... (repeat for all 7 questions)
  ],
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "missing_concepts": ["concept 1", "concept 2", ...],
  "shallow_answer_detected": boolean,
  "ai_generated_response_detected": boolean,
  "assessment_confidence": number (0.0-1.0),
  "notes": "brief overall assessment notes"
}
[/INST]`;
};

/**
 * Detailed roadmap generation prompt - creates personalized 60-day plan
 * Score-aware and weakness-aware personalization
 */
const createDetailedRoadmapPrompt = (topic, analysis) => {
    const { overall_score, section_scores, weaknesses, strengths, missing_concepts } = analysis;

    const scoreLevel = overall_score >= 80 ? 'advanced'
        : overall_score >= 60 ? 'intermediate'
        : overall_score >= 40 ? 'developing'
        : 'beginner';

    return `[INST] You are an expert learning coach creating a personalized 60-day learning roadmap for "${topic}".

Learner Profile:
- Overall Score: ${overall_score}/100
- Skill Level: ${scoreLevel}
- Fundamentals Score: ${section_scores.fundamentals}/100
- Practical Score: ${section_scores.practical}/100
- Advanced Score: ${section_scores.advanced}/100
- Key Strengths: ${strengths.join(', ') || 'None identified'}
- Key Weaknesses: ${weaknesses.join(', ') || 'None identified'}
- Missing Concepts: ${missing_concepts.join(', ') || 'None identified'}

**ROADMAP REQUIREMENTS:**
1. Create a 60-day learning plan (4 phases of 15 days each)
2. ADAPT based on current score and weaknesses:
   - Score < 50: Spend more time on Phase 1 fundamentals
   - Score 50-75: Balance all phases appropriately
   - Score > 75: Focus on advanced topics and specialization
3. For each weakness identified, create specific learning tasks
4. Include realistic time estimates
5. Include practical projects with real-world applications
6. Include job role progression (junior → senior requirements)
7. Add resources, tools, and technologies for each phase
8. Be realistic about learning timelines - weeks/months, not days

**ROADMAP STRUCTURE:**

For each phase (15 days):
- Learning objectives (what learner will know/do)
- Key topics to cover (3-5 main topics)
- Daily breakdown (recommend specific activities)
- Practical projects (2-3 per phase)
- Tools & technologies
- Resources (books, courses, documentation)
- Assessment checkpoints
- Time estimates

**PHASE GUIDANCE:**
- Phase 1 (Days 1-15): FOUNDATIONS - Master fundamentals and core concepts
- Phase 2 (Days 16-30): CORE CONCEPTS - Deepen understanding with practical application
- Phase 3 (Days 31-45): ADVANCED MASTERY - Develop expertise with advanced patterns
- Phase 4 (Days 46-60): CAREER PREPARATION - Build portfolio and interview readiness

**WEAKNESS ADAPTATION:**
${weaknesses.length > 0 ? `For identified weaknesses (${weaknesses.join(', ')}):
- Add targeted exercises and practice
- Include projects that directly address these gaps
- Recommend specific learning resources focused on these areas
- Add checkpoint assessments` : ''}

**JOB ROLE PROGRESSION:**
- Entry-level (Junior): What competencies are required?
- Mid-level: What additional skills needed?
- Senior-level: What expertise separates senior from mid-level?

Return ONLY valid JSON with no additional text:
{
  "duration_days": 60,
  "skill_level_start": "${scoreLevel}",
  "skill_level_end": "advanced|expert",
  "personalization_notes": "why this roadmap is tailored to this learner",
  "phase_1": {
    "title": "Foundations & Basics (Days 1-15)",
    "overview": "description",
    "objectives": ["objective 1", "objective 2", ...],
    "topics": ["topic 1", "topic 2", ...],
    "daily_breakdown": {
      "days_1_3": "activity description",
      "days_4_7": "activity description",
      "days_8_11": "activity description",
      "days_12_15": "activity description"
    },
    "projects": ["project 1", "project 2"],
    "tools_and_tech": ["tool 1", "tool 2"],
    "resources": ["resource 1", "resource 2"],
    "checkpoint": "What learner should know/do by day 15"
  },
  "phase_2": { ... similar structure ... },
  "phase_3": { ... similar structure ... },
  "phase_4": { ... similar structure ... },
  "job_roles": {
    "junior_developer": {
      "title": "Junior/Entry-level Developer",
      "required_competencies": ["competency 1", "competency 2", ...],
      "estimated_experience": "0-2 years"
    },
    "mid_level": {
      "title": "Mid-level/Senior Developer",
      "required_competencies": ["competency 1", "competency 2", ...],
      "estimated_experience": "2-5 years"
    },
    "senior_expert": {
      "title": "Senior/Expert Developer",
      "required_competencies": ["competency 1", "competency 2", ...],
      "estimated_experience": "5+ years"
    }
  },
  "success_metrics": {
    "week_2": "What learner should be able to do",
    "week_4": "What learner should be able to do",
    "week_8": "What learner should be able to do",
    "week_12": "What learner should be able to do"
  },
  "estimated_time_commitment": "X hours per day recommended",
  "next_steps_after_60_days": ["step 1", "step 2", ...]
}
[/INST]`;
};

/**
 * Coaching prompt - generates adaptive feedback based on performance
 */
const createAdaptiveCoachingPrompt = (topic, analysis) => {
    const { overall_score, strengths, weaknesses } = analysis;
    const level = overall_score >= 80 ? 'advanced' : overall_score >= 60 ? 'intermediate' : 'developing';

    return `[INST] You are a supportive learning coach providing personalized feedback to a student learning "${topic}".

Student Performance:
- Score: ${overall_score}/100
- Level: ${level}
- Strengths: ${strengths.join(', ')}
- Areas for improvement: ${weaknesses.join(', ')}

Create a brief, encouraging coaching message that:
1. Acknowledges their current strengths
2. Provides specific guidance on areas to improve
3. Gives concrete next steps
4. Is motivating and supportive, not discouraging
5. Is personalized to their score level

Keep it to 3-4 paragraphs.
[/INST]`;
};

/**
 * Domain-specific quiz prompt for next adaptive question
 */
const createAdaptiveFollowUpPrompt = (topic, previousAnswers, analysis) => {
    const { weaknesses } = analysis;
    const focusArea = weaknesses[0] || 'advanced concepts';

    return `[INST] You are an expert creating a follow-up assessment question for "${topic}".

Previous answers showed particular difficulty with: ${focusArea}

Create ONE follow-up question that:
1. Digs deeper into this weak area
2. Probes understanding of why they struggled
3. Asks for practical application in their weak area
4. Is challenging but achievable
5. Helps them understand the gap in their knowledge

Return ONLY the question text (no JSON, plain text):
[/INST]`;
};

module.exports = {
    createComprehensiveQuizPrompt,
    createSemanticEvaluationPrompt,
    createDetailedRoadmapPrompt,
    createAdaptiveCoachingPrompt,
    createAdaptiveFollowUpPrompt,
};
