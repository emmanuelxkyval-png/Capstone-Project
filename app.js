const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./cashtrack-backend/src/routes/auth.routes');
const userRoutes = require('./cashtrack-backend/src/routes/user.routes');
const inflowRoutes = require('./cashtrack-backend/src/routes/inflow.routes');
const outflowRoutes = require('./cashtrack-backend/src/routes/outflow.routes');
const summaryRoutes = require('./cashtrack-backend/src/routes/summary.routes');

// Import middleware
const errorHandler = require('./cashtrack-backend/src/middleware/error.middleware');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5005'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'CASHTRACK API is running',
        timestamp: new Date().toISOString()
    });
});

// API version prefix
const API_VERSION = process.env.API_VERSION || 'v1';

// Routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/inflows`, inflowRoutes);
app.use(`/api/${API_VERSION}/outflows`, outflowRoutes);
app.use(`/api/${API_VERSION}/summary`, summaryRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
