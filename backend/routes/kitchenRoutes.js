const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const { Order, OrderItem, MenuItem } = require('../models/index');

// @desc    Get kitchen queue (pending + preparing orders)
// @route   GET /api/kitchen
router.get('/', protect, allowRoles('admin', 'manager', 'chef'), async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        tenant_id: req.user.tenant_id,
        status: ['pending', 'preparing']
      },
      include: [{
        model: OrderItem,
        include: [MenuItem]
      }],
      order: [['createdAt', 'ASC']]
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;