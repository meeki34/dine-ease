const express = require('express');
const router = express.Router();
const {
  getAllTenants,
  updateTenant,
  deleteTenant,
  getStats
} = require('../controllers/superAdminController');
const { protect, allowRoles } = require('../middleware/auth');

// All routes protected - superadmin only
router.use(protect);
router.use(allowRoles('superadmin'));

// Get all tenants
router.get('/tenants', getAllTenants);

// Update tenant
router.put('/tenants/:id', updateTenant);

// Delete tenant
router.delete('/tenants/:id', deleteTenant);

// Get all stats
router.get('/stats', getStats);

module.exports = router;