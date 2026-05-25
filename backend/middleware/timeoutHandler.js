// middleware/timeoutHandler.js

const ApiError = require('../utils/ApiError');

const timeoutHandler = (req, res, next) => {
    const timeout = process.env.REQUEST_TIMEOUT_MS || 45000;

    const timeoutId = setTimeout(() => {
        // If the response hasn't been sent, throw a timeout error
        if (!res.headersSent) {
            next(new ApiError('Request timed out. The server is taking too long to respond.', 504)); // 504 Gateway Timeout
        }
    }, timeout);

    // Clear the timeout if the response finishes in time
    res.on('finish', () => {
        clearTimeout(timeoutId);
    });
    
    res.on('close', () => {
        clearTimeout(timeoutId);
    });

    next();
};

module.exports = timeoutHandler;
