const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User no longer exists'
                });
            }

            if (!req.user.isActive) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User account is inactive'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error during authentication'
        });
    }
};
