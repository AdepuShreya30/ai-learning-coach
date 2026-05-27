// server.js

// Load environment variables from .env file FIRST
const dotenv = require('dotenv');
dotenv.config();

// Module Imports
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

// Middleware and Util Imports
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const timeoutHandler = require('./middleware/timeoutHandler');
const ApiError = require('./utils/ApiError');

// Route Imports
const aiCoachRoutes = require('./routes/aiCoachRoutes');

// Initialize Express app
const app = express();

// --- Core Middleware ---

// Set security HTTP headers (disable CORS-blocking for development)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : process.env.FRONTEND_URL,
  credentials: true,
}));

// Body parser middleware to handle raw JSON
app.use(express.json());

// Logger middleware (using 'dev' format for concise output)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Request timeout middleware
app.use(timeoutHandler);

// Apply the rate limiting middleware to all requests
app.use(rateLimiter);


// --- API Routes ---

// Mount the AI Coach routes
app.use('/api/coach', aiCoachRoutes);


// --- Error Handling ---

// Handle 404 errors for unhandled routes
app.all('*', (req, res, next) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware (must be the last middleware)
app.use(errorHandler);


// --- Server Initialization ---

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'production'} mode.`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
