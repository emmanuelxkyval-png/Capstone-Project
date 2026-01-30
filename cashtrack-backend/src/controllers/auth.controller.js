const User = require('../models/User.model');
const { generateToken } = require('../utils/jwt.util');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
    try {
        const { businessName, businessType, email, password } = req.body;

        // Validation
        if (!businessName || !businessType || !email || !password) {
            return errorResponse(res, 400, 'Please provide all required fields');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 400, 'User with this email already exists');
        }

        // Create user
        const user = await User.create({
            businessName,
            businessType,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        successResponse(res, 201, 'User registered successfully', {
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return errorResponse(res, 400, 'Please provide email and password');
        }

        // Check if user exists (include password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        // Check if password matches
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Invalid credentials');
        }

        // Check if user is active
        if (!user.isActive) {
            return errorResponse(res, 401, 'Account is inactive');
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        successResponse(res, 200, 'Login successful', {
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        successResponse(res, 200, 'User retrieved successfully', { user });
    } catch (error) {
        next(error);
    }
};
