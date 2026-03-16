const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable
} = require('../controllers/tableController');
const { protect, allowRoles } = require('../middleware/auth');

// All routes protected
router.use(protect);

// Get all tables - all roles
router.get('/', getTables);

// Create table - admin only
router.post('/', allowRoles('admin'), createTable);

// Update table - admin and manager
router.put('/:id', allowRoles('admin', 'manager'), updateTable);

// Delete table - admin only
router.delete('/:id', allowRoles('admin'), deleteTable);

module.exports = router;