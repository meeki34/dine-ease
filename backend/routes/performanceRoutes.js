const express = require('express');
const router = express.Router();
const { getEmployeeStats, getShifts, createShift, updateShift, deleteShift } = require('../controllers/performanceController');
const { protect, allowRoles } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getEmployeeStats);
router.get('/shifts', getShifts);
router.post('/shifts', allowRoles('admin', 'manager'), createShift);
router.put('/shifts/:id', allowRoles('admin', 'manager'), updateShift);
router.delete('/shifts/:id', allowRoles('admin', 'manager'), deleteShift);

module.exports = router;
