const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.get('/daily', summaryController.getDailySummary);
router.get('/range', summaryController.getRangeSummary);
router.get('/history', summaryController.getTransactionHistory);

module.exports = router;
