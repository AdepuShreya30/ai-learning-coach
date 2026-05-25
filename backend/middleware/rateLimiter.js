// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: process.env.API_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.API_RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

module.exports = limiter;
