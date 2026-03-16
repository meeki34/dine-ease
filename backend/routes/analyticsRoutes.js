const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const { getAnalytics } = require('../controllers/analyticsController');

router.get('/', protect, allowRoles('admin', 'manager'), getAnalytics);

module.exports = router;

