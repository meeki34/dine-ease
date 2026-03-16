const express = require('express');
const router = express.Router();
const { 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} = require('../controllers/menuController');
const { protect, allowRoles } = require('../middleware/auth');

// All routes protected
router.use(protect);

// Get all menu items - all roles can view
router.get('/', getMenuItems);

// Create menu item - admin and manager only
router.post('/', allowRoles('admin', 'manager'), createMenuItem);

// Update menu item - admin and manager only
router.put('/:id', allowRoles('admin', 'manager'), updateMenuItem);

// Delete menu item - admin only
router.delete('/:id', allowRoles('admin'), deleteMenuItem);

module.exports = router;