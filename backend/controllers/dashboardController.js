const { User, MenuItem, Order, Table, Expense } = require('../models/index');
const { Op } = require('sequelize');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;

    // Total staff
    const totalStaff = await User.count({
      where: { tenant_id, is_active: true }
    });

    // Total menu items
    const totalMenuItems = await MenuItem.count({
      where: { tenant_id }
    });

    // Total tables
    const totalTables = await Table.count({
      where: { tenant_id }
    });

    // Available tables
    const availableTables = await Table.count({
      where: { tenant_id, status: 'available' }
    });

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.count({
      where: {
        tenant_id,
        createdAt: { [Op.gte]: today }
      }
    });

    // Today's revenue
    const todayRevenue = await Order.sum('total_amount', {
      where: {
        tenant_id,
        status: { [Op.ne]: 'cancelled' },
        createdAt: { [Op.gte]: today }
      }
    });

    // Today's expenses (by expense_date)
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayExpenses = await Expense.sum('amount', {
      where: {
        tenant_id,
        expense_date: todayStr,
      },
    });

    // Pending orders
    const pendingOrders = await Order.count({
      where: { tenant_id, status: 'pending' }
    });

    // Preparing orders
    const preparingOrders = await Order.count({
      where: { tenant_id, status: 'preparing' }
    });

    // Total revenue
    const totalRevenue = await Order.sum('total_amount', {
      where: {
        tenant_id,
        status: { [Op.ne]: 'cancelled' }
      }
    });

    res.json({
      success: true,
      data: {
        staff: {
          total: totalStaff
        },
        menu: {
          total: totalMenuItems
        },
        tables: {
          total: totalTables,
          available: availableTables,
          occupied: totalTables - availableTables
        },
        orders: {
          today: todayOrders,
          pending: pendingOrders,
          preparing: preparingOrders
        },
        revenue: {
          today: todayRevenue || 0,
          total: totalRevenue || 0
        },
        expenses: {
          today: todayExpenses || 0,
        },
        profit: {
          today: (todayRevenue || 0) - (todayExpenses || 0),
        },
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
