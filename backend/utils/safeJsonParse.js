// utils/safeJsonParse.js

const ApiError = require('./ApiError');

/**
 * Safely parses a JSON string, extracting it from surrounding text if necessary.
 * LLMs can sometimes wrap JSON in backticks or add introductory text.
 * @param {string} text - The raw string response from the LLM.
 * @param {string} taskDescription - Description of the parsing task for error messages.
 * @returns {object} The parsed JavaScript object.
 * @throws {ApiError} If the JSON is malformed or cannot be found.
 */
const safeJsonParse = (text, taskDescription = 'processing AI response') => {
    try {
        // Find the start and end of the JSON object
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
            throw new Error('Valid JSON object not found in the response.');
        }

        const jsonString = text.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);

    } catch (error) {
        console.error(`Failed to parse JSON for ${taskDescription}:`, error.message);
        console.error('Original text from LLM:', text);
        throw new ApiError(`The AI returned a malformed response for ${taskDescription}. Could not parse JSON.`, 500);
    }
};

module.exports = safeJsonParse;
