const express = require('express');
const router = express.Router();
const { updateSettings } = require('../controllers/tenantController');
const { protect, allowRoles } = require('../middleware/auth');

router.put('/settings', protect, allowRoles('admin', 'manager'), updateSettings);

module.exports = router;
