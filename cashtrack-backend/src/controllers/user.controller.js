const User = require('../models/User.model');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        successResponse(res, 200, 'Profile retrieved successfully', { user });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const { businessName, businessType } = req.body;

        const fieldsToUpdate = {};
        if (businessName) fieldsToUpdate.businessName = businessName;
        if (businessType) fieldsToUpdate.businessType = businessType;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            { new: true, runValidators: true }
        );

        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        successResponse(res, 200, 'Profile updated successfully', { user });
    } catch (error) {
        next(error);
    }
};
