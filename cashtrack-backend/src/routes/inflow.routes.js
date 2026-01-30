const express = require('express');
const router = express.Router();
const inflowController = require('../controllers/inflow.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.post('/', inflowController.createInflow);
router.get('/', inflowController.getInflows);
router.get('/:id', inflowController.getInflowById);
router.put('/:id', inflowController.updateInflow);
router.delete('/:id', inflowController.deleteInflow);

module.exports = router;
