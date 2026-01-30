const Outflow = require('../models/Outflow.model');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @desc    Create new outflow
 * @route   POST /api/v1/outflows
 * @access  Private
 */
exports.createOutflow = async (req, res, next) => {
    try {
        const { amount, date, category, note } = req.body;

        // Validation
        if (!amount || amount <= 0) {
            return errorResponse(res, 400, 'Please provide a valid amount');
        }

        const outflow = await Outflow.create({
            user: req.user.id,
            amount,
            date: date || new Date(),
            category: category || 'other',
            note
        });

        successResponse(res, 201, 'Outflow created successfully', { outflow });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all outflows for logged in user
 * @route   GET /api/v1/outflows?date=YYYY-MM-DD&category=restocking&page=1&limit=10
 * @access  Private
 */
exports.getOutflows = async (req, res, next) => {
    try {
        const { date, category, page = 1, limit = 50 } = req.query;

        const query = { user: req.user.id, isDeleted: false };

        // Filter by date
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.date = { $gte: startDate, $lte: endDate };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const outflows = await Outflow.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Outflow.countDocuments(query);

        successResponse(res, 200, 'Outflows retrieved successfully', {
            outflows,
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
 * @desc    Get single outflow by ID
 * @route   GET /api/v1/outflows/:id
 * @access  Private
 */
exports.getOutflowById = async (req, res, next) => {
    try {
        const outflow = await Outflow.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!outflow) {
            return errorResponse(res, 404, 'Outflow not found');
        }

        successResponse(res, 200, 'Outflow retrieved successfully', { outflow });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update outflow
 * @route   PUT /api/v1/outflows/:id
 * @access  Private
 */
exports.updateOutflow = async (req, res, next) => {
    try {
        const { amount, date, category, note } = req.body;

        let outflow = await Outflow.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!outflow) {
            return errorResponse(res, 404, 'Outflow not found');
        }

        // Update fields
        if (amount !== undefined) outflow.amount = amount;
        if (date !== undefined) outflow.date = date;
        if (category !== undefined) outflow.category = category;
        if (note !== undefined) outflow.note = note;

        await outflow.save();

        successResponse(res, 200, 'Outflow updated successfully', { outflow });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete outflow (soft delete)
 * @route   DELETE /api/v1/outflows/:id
 * @access  Private
 */
exports.deleteOutflow = async (req, res, next) => {
    try {
        const outflow = await Outflow.findOne({
            _id: req.params.id,
            user: req.user.id,
            isDeleted: false
        });

        if (!outflow) {
            return errorResponse(res, 404, 'Outflow not found');
        }

        await outflow.softDelete();

        successResponse(res, 200, 'Outflow deleted successfully', null);
    } catch (error) {
        next(error);
    }
};
