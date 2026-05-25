// utils/asyncHandler.js

/**
 * Wraps an async function to catch errors and pass them to the next middleware.
 * This avoids repetitive try-catch blocks in controllers.
 * @param {Function} fn - The async controller function to wrap.
 * @returns {Function} A new function that handles errors.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
