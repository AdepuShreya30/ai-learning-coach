// middleware/validator.js

const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const generateQuestionsValidationRules = () => {
    return [
        body('topic')
            .trim()
            .notEmpty().withMessage('Topic is required.')
            .isString().withMessage('Topic must be a string.')
            .isLength({ min: 3, max: 100 }).withMessage('Topic must be between 3 and 100 characters.'),
    ];
};

const evaluateValidationRules = () => {
    return [
        body('topic')
            .trim()
            .notEmpty().withMessage('Topic is required.')
            .isString().withMessage('Topic must be a string.')
            .isLength({ min: 3, max: 100 }).withMessage('Topic must be between 3 and 100 characters.'),

        body('answers')
            .isArray({ min: 1 }).withMessage('At least one answer is required.')
            .withMessage('Answers must be an array of strings.'),

        body('answers.*')
            .trim()
            .notEmpty().withMessage('Answers cannot be empty strings.')
            .isString().withMessage('Each answer must be a string.'),

        body('questions')
            .isArray({ min: 1 }).withMessage('Questions array is required.')
            .withMessage('Questions must be an array.'),
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));

    return next(new ApiError(`Validation failed: ${JSON.stringify(extractedErrors)}`, 422));
};

module.exports = {
    generateQuestionsValidationRules,
    evaluateValidationRules,
    validate,
};
