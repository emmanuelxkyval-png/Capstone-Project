const express = require('express');
const router = express.Router();
const outflowController = require('../controllers/outflow.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.post('/', outflowController.createOutflow);
router.get('/', outflowController.getOutflows);
router.get('/:id', outflowController.getOutflowById);
router.put('/:id', outflowController.updateOutflow);
router.delete('/:id', outflowController.deleteOutflow);

module.exports = router;
