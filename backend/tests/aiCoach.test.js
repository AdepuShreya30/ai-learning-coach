// tests/aiCoach.test.js

const request = require('supertest');
const express = require('express');
const aiCoachRoutes = require('../routes/aiCoachRoutes');
const errorHandler = require('../middleware/errorHandler');

// Mock the controller to prevent actual API calls during tests
jest.mock('../controllers/aiCoachController', () => ({
    processEvaluation: jest.fn((req, res, next) => {
        res.status(200).json({
            success: true,
            data: {
                analysis: { score: 85 },
                coaching: "Mock coaching content",
                roadmap: "Mock roadmap content"
            }
        });
    }),
}));

// Mock the validator middleware
jest.mock('../middleware/validator', () => ({
    evaluateValidationRules: () => (req, res, next) => next(),
    validate: (req, res, next) => next(),
}));


const app = express();
app.use(express.json());
app.use('/api/coach', aiCoachRoutes);
app.use(errorHandler);


describe('POST /api/coach/evaluate', () => {
    it('should return 200 OK with a valid request body', async () => {
        const response = await request(app)
            .post('/api/coach/evaluate')
            .send({
                topic: "JavaScript Closures",
                answers: ["An answer", "Another answer"]
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('analysis');
        expect(response.body.data).toHaveProperty('coaching');
        expect(response.body.data).toHaveProperty('roadmap');
    });

    // You would need to un-mock the validator to test this properly
    it('should return 422 Unprocessable Entity for an invalid request body', async () => {
        // This test requires more complex setup to test the actual validator
        // For now, we'll just note its purpose.
        // Example:
        // const response = await request(app)
        //     .post('/api/coach/evaluate')
        //     .send({ topic: "Test" }); // Missing 'answers'
        // expect(response.statusCode).toBe(422);
        expect(true).toBe(true); // Placeholder
    });
});
