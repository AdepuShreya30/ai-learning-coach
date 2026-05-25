// utils/aiPromptUtils.js

/**
 * Creates a prompt to generate quiz questions for a learning topic.
 * @param {string} topic - The learning topic.
 * @returns {string} The formatted prompt for the LLM.
 */
const createQuizGenerationPrompt = (topic) => {
    return `[INST] You are an expert AI curriculum designer. Your task is to create 3 quiz questions that assess a learner's understanding of "${topic}".

Create questions that test different levels:
1. Question 1: Fundamental concepts and definitions
2. Question 2: Application of concepts to real-world scenarios
3. Question 3: Critical thinking and advanced understanding

Return ONLY a valid JSON object with no additional text:
{
  "questions": [
    {
      "id": 1,
      "question": "question text here"
    },
    {
      "id": 2,
      "question": "question text here"
    },
    {
      "id": 3,
      "question": "question text here"
    }
  ]
}
[/INST]`;
};

/**
 * Creates a prompt to analyze a learner's answers and provide a structured JSON output.
 * @param {string} topic - The learning topic.
 * @param {Array} questions - The quiz questions that were asked.
 * @param {string[]} answers - An array of the learner's answers.
 * @returns {string} The formatted prompt for the LLM.
 */
const createAnalysisPrompt = (topic, questions, answers) => {
    const qaFormat = questions
        .map((q, idx) => `Q${idx + 1}: ${q.question}\nAnswer: ${answers[idx]}`)
        .join('\n\n');

    return `[INST] You are an expert AI teaching assistant. Your task is to analyze a learner's quiz answers about "${topic}".

Quiz Questions and Answers:
${qaFormat}

Evaluate each answer for correctness, depth, understanding, and clarity. Based on this analysis:
- Assign an overall score from 0-100
- Identify specific weak topics where the learner struggled
- Identify specific strengths the learner demonstrated
- Write a brief performance summary

Return ONLY a valid JSON object with no additional text:
{
  "score": number,
  "weak_topics": [string array of specific concepts],
  "strengths": [string array of specific concepts],
  "summary": "one paragraph summary"
}
[/INST]`;
};

/**
 * Creates a prompt to generate beginner-friendly explanations for weak topics.
 * @param {string} topic - The main learning topic.
 * @param {string[]} weakTopics - A list of topics the learner needs help with.
 * @returns {string} The formatted prompt for the LLM.
 */
const createBeginnerExplanationPrompt = (topic, weakTopics) => {
    return `[INST] You are a friendly and patient AI tutor. A student is struggling with some concepts related to "${topic}".
Explain the following weak topics in a simple, beginner-friendly way. Use analogies and simple examples. Avoid complex jargon.

Weak topics to explain:
- ${weakTopics.join('\n- ')}

Provide a clear, encouraging, and easy-to-understand explanation.
[/INST]
`;
};

/**
 * Creates a prompt to generate advanced challenge problems based on strengths.
 * @param {string} topic - The main learning topic.
 * @param {string[]} strengths - A list of topics the learner understands well.
 * @returns {string} The formatted prompt for the LLM.
 */
const createAdvancedChallengePrompt = (topic, strengths) => {
    return `[INST] You are an expert AI curriculum designer. A student has demonstrated a strong understanding of several concepts within the topic of "${topic}".
Create one or two advanced challenge problems that build upon their strengths and push their understanding further. The problems should require critical thinking and application of knowledge.

The student's strong areas are:
- ${strengths.join('\n- ')}

Generate challenging problems based on these strengths.
[/INST]
`;
};

/**
 * Creates a prompt to generate a personalized 7-day learning roadmap.
 * @param {string} topic - The main learning topic.
 * @param {object} analysis - The analysis object containing score, weaknesses, and strengths.
 * @returns {string} The formatted prompt for the LLM.
 */
const createRoadmapPrompt = (topic, analysis) => {
    const { score, weak_topics, strengths } = analysis;

    return `[INST] You are an expert AI learning coach. A learner has just been assessed on the topic of "${topic}".
Their performance analysis is as follows:
- Overall Score: ${score}/100
- Strengths: ${strengths.join(', ') || 'None identified'}
- Weaknesses: ${weak_topics.join(', ') || 'None identified'}

Your task is to create a personalized 7-day learning roadmap to help this learner master "${topic}".
The plan should be practical, with daily actionable tasks.
- For weaknesses, focus on foundational review and practice.
- For strengths, suggest advanced topics or projects to deepen their knowledge.
- The tone should be encouraging and motivational.

Generate the 7-day learning plan now.
[/INST]
`;
};


module.exports = {
    createQuizGenerationPrompt,
    createAnalysisPrompt,
    createBeginnerExplanationPrompt,
    createAdvancedChallengePrompt,
    createRoadmapPrompt,
};
