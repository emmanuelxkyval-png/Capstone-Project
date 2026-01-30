const Inflow = require('../models/Inflow.model');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @desc    Create new inflow
 * @route   POST /api/v1/inflows
 * @access  Private
 */
exports.createInflow = async (req, res, next) => {
    try {
        const { amount, date, paymentChannel, note } = req.body;

        // Validation
        if (!amount || amount <= 0) {
            return errorResponse(res, 400, 'Please provide a valid amount');
        }

        const inflow = await Inflow.create({
            user: req.user.id,
            amount,
            date: date || new Date(),
            paymentChannel: paymentChannel || 'cash',
            note
        });

        successResponse(res, 201, 'Inflow created successfully', { inflow });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all inflows for logged in user
 * @route   GET /api/v1/inflows?date=YYYY-MM-DD&channel=cash&page=1&limit=10
 * @access  Private
 */
exports.getInflows = async (req, res, next) => {
    try {
        const { date, channel, page = 1, limit = 50 } = req.query;

        const query = { user: req.user.id, isDeleted: false };

        // Filter by date
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.date = { $gte: startDate, $lte: endDate };
        }

        // Filter by payment channel
        if (channel) {
            query.paymentChannel = channel;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const inflows = await Inflow.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Inflow.countDocuments(query);

        successResponse(res, 200, 'Inflows retrieved successfully', {
            inflows,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single inflow by ID
 * @route   GET /api/v1/inflows/:id
 * @access  Private
 */
exports.getInflowById = async (req, res, next) => {
    try {
        const inflow = await Inflow.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!inflow) {
            return errorResponse(res, 404, 'Inflow not found');
        }

        successResponse(res, 200, 'Inflow retrieved successfully', { inflow });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update inflow
 * @route   PUT /api/v1/inflows/:id
 * @access  Private
 */
exports.updateInflow = async (req, res, next) => {
    try {
        const { amount, date, paymentChannel, note } = req.body;

        let inflow = await Inflow.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!inflow) {
            return errorResponse(res, 404, 'Inflow not found');
        }

        // Update fields
        if (amount !== undefined) inflow.amount = amount;
        if (date !== undefined) inflow.date = date;
        if (paymentChannel !== undefined) inflow.paymentChannel = paymentChannel;
        if (note !== undefined) inflow.note = note;

        await inflow.save();

        successResponse(res, 200, 'Inflow updated successfully', { inflow });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete inflow (soft delete)
 * @route   DELETE /api/v1/inflows/:id
 * @access  Private
 */
exports.deleteInflow = async (req, res, next) => {
    try {
        const inflow = await Inflow.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!inflow) {
            return errorResponse(res, 404, 'Inflow not found');
        }

        await inflow.softDelete();

        successResponse(res, 200, 'Inflow deleted successfully', null);
    } catch (error) {
        next(error);
    }
};
