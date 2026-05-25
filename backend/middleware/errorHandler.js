// middleware/errorHandler.js

const ApiError = require('../utils/ApiError');

const handleValidationError = (err) => {
    const errors = err.array().map(el => el.msg);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ApiError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else { // In production
        let error = { ...err, message: err.message };

        // Handle specific error types for production
        if (error.name === 'ValidationError') error = handleValidationError(error);
        
        sendErrorProd(error, res);
    }
};
