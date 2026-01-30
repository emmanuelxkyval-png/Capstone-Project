const Inflow = require('../models/Inflow.model');
const Outflow = require('../models/Outflow.model');
const { successResponse, errorResponse } = require('../utils/response.util');

/**
 * @desc    Get daily cash summary
 * @route   GET /api/v1/summary/daily?date=YYYY-MM-DD
 * @access  Private
 */
exports.getDailySummary = async (req, res, next) => {
    try {
        const { date } = req.query;

        if (!date) {
            return errorResponse(res, 400, 'Please provide a date');
        }

        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Get total inflows
        const inflowsResult = await Inflow.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startDate, $lte: endDate },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get total outflows
        const outflowsResult = await Outflow.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startDate, $lte: endDate },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalInflows = inflowsResult.length > 0 ? inflowsResult[0].total : 0;
        const totalOutflows = outflowsResult.length > 0 ? outflowsResult[0].total : 0;
        const inflowCount = inflowsResult.length > 0 ? inflowsResult[0].count : 0;
        const outflowCount = outflowsResult.length > 0 ? outflowsResult[0].count : 0;

        const summary = {
            date,
            totalInflows,
            totalOutflows,
            netBalance: totalInflows - totalOutflows,
            inflowCount,
            outflowCount,
            totalTransactions: inflowCount + outflowCount
        };

        successResponse(res, 200, 'Daily summary retrieved successfully', { summary });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get summary for date range
 * @route   GET /api/v1/summary/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * @access  Private
 */
exports.getRangeSummary = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return errorResponse(res, 400, 'Please provide start and end dates');
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const inflowsResult = await Inflow.aggregate([
            { $match: { user: req.user._id, date: { $gte: start, $lte: end }, isDeleted: false } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const outflowsResult = await Outflow.aggregate([
            { $match: { user: req.user._id, date: { $gte: start, $lte: end }, isDeleted: false } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const totalInflows = inflowsResult.length > 0 ? inflowsResult[0].total : 0;
        const totalOutflows = outflowsResult.length > 0 ? outflowsResult[0].total : 0;

        const summary = {
            startDate,
            endDate,
            totalInflows,
            totalOutflows,
            netBalance: totalInflows - totalOutflows
        };

        successResponse(res, 200, 'Range summary retrieved successfully', { summary });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get transaction history
 * @route   GET /api/v1/summary/history?page=1&limit=20
 * @access  Private
 */
exports.getTransactionHistory = async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const inflows = await Inflow.find({ user: req.user.id, isDeleted: false }).sort({ date: -1 });
        const outflows = await Outflow.find({ user: req.user.id, isDeleted: false }).sort({ date: -1 });

        const transactions = [
            ...inflows.map(i => ({ _id: i._id, type: 'inflow', amount: i.amount, date: i.date, paymentChannel: i.paymentChannel, note: i.note })),
            ...outflows.map(o => ({ _id: o._id, type: 'outflow', amount: o.amount, date: o.date, category: o.category, note: o.note }))
        ];

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        const paginatedTransactions = transactions.slice(skip, skip + parseInt(limit));

        successResponse(res, 200, 'Transaction history retrieved successfully', {
            transactions: paginatedTransactions,
            pagination: { total: transactions.length, page: parseInt(page), pages: Math.ceil(transactions.length / parseInt(limit)) }
        });
    } catch (error) {
        next(error);
    }
};
