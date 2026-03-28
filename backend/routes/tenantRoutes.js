const express = require('express');
const router = express.Router();
const { updateSettings, changePassword, getProfile } = require('../controllers/tenantController');
const { protect, allowRoles } = require('../middleware/auth');

router.get('/profile', protect, allowRoles('admin', 'manager'), getProfile);
router.put('/settings', protect, allowRoles('admin', 'manager'), updateSettings);
router.put('/password', protect, changePassword);

module.exports = router;
