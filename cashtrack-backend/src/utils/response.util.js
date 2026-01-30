/**
 * Standardized success response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object} data - Response data
 */
exports.successResponse = (res, statusCode, message, data = null) => {
    const response = {
        status: 'success',
        message
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Standardized error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */
exports.errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: 'error',
        message
    });
};
