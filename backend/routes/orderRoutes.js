const express = require('express');
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  getOrder
} = require('../controllers/orderController');
const { protect, allowRoles } = require('../middleware/auth');

// All routes protected
router.use(protect);

// Get all orders - admin, manager, chef
router.get('/', getOrders);

// Get single order
router.get('/:id', getOrder);

// Create order - admin, manager, waiter
router.post('/', allowRoles('admin', 'manager', 'waiter'), createOrder);

// Update order status - admin, manager, chef, waiter
router.put('/:id/status', allowRoles('admin', 'manager', 'chef', 'waiter'), updateOrderStatus);

module.exports = router;
