const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, allowRoles } = require('../middleware/auth');

// Protected - admin and manager only
router.get('/', protect, allowRoles('admin', 'manager'), getDashboardStats);

module.exports = router;