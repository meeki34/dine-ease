const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const { getAnalytics, recordDailyLog } = require('../controllers/analyticsController');

router.get('/', protect, allowRoles('admin', 'manager'), getAnalytics);
router.post('/log', protect, allowRoles('admin', 'manager'), recordDailyLog);

module.exports = router;

