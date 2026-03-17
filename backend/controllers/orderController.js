const { Order, OrderItem, MenuItem } = require('../models/index');
const { emitUpdate } = require('../utils/socket');

const VALID_STATUSES = new Set(['pending', 'preparing', 'ready', 'served', 'cancelled']);

const canSetStatus = ({ role, currentStatus, nextStatus }) => {
  // Terminal states: do not allow transitions out of served/cancelled (except admin/manager via controller below)
  if (role === 'waiter') {
    return currentStatus === 'ready' && nextStatus === 'served';
  }

  if (role === 'chef') {
    if (currentStatus === 'served' || currentStatus === 'cancelled') return false;
    if (nextStatus === 'preparing') return currentStatus === 'pending';
    if (nextStatus === 'ready') return currentStatus === 'pending' || currentStatus === 'preparing';
    return false;
  }

  // admin/manager: allow any valid status (including corrections)
  return true;
};

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = async (req, res) => {
  try {
    if (!req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const where = { tenant_id: req.user.tenant_id };
    if (req.user.role === 'waiter') {
      where.created_by = req.user.id;
    }

    const orders = await Order.findAll({
      where,
      include: [{
        model: OrderItem,
        include: [MenuItem]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    if (!req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const { table_number, items, notes } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required' });
    }

    // Calculate total
    let total_amount = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menu_item_id);
      if (!menuItem) {
        return res.status(404).json({ 
          success: false, 
          message: `Menu item ${item.menu_item_id} not found` 
        });
      }
      total_amount += menuItem.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      tenant_id: req.user.tenant_id,
      table_number,
      total_amount,
      notes,
      created_by: req.user.id
    });

    // Create order items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menu_item_id);
      await OrderItem.create({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Fetch complete order
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [MenuItem]
      }]
    });

    emitUpdate(req.user.tenant_id, 'analytics_update');
 
    res.status(201).json({ success: true, data: completeOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    if (!VALID_STATUSES.has(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.user.tenant_id 
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role === 'waiter' && order.created_by !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    const role = req.user.role;
    const currentStatus = order.status;
    const nextStatus = status;

    if (role !== 'admin' && role !== 'manager' && role !== 'chef' && role !== 'waiter') {
      return res.status(403).json({ success: false, message: 'Not authorized to update status' });
    }

    if ((currentStatus === 'served' || currentStatus === 'cancelled') && (role === 'chef' || role === 'waiter')) {
      return res.status(400).json({ success: false, message: 'Order is already closed' });
    }

    if ((role === 'chef' || role === 'waiter') && !canSetStatus({ role, currentStatus, nextStatus })) {
      return res.status(403).json({ success: false, message: 'Status change not allowed for this role' });
    }

    await order.update({ status });
    emitUpdate(order.tenant_id, 'analytics_update');
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    if (!req.user.tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const where = {
      id: req.params.id,
      tenant_id: req.user.tenant_id
    };

    if (req.user.role === 'waiter') {
      where.created_by = req.user.id;
    }

    const order = await Order.findOne({
      where,
      include: [{
        model: OrderItem,
        include: [MenuItem]
      }]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
