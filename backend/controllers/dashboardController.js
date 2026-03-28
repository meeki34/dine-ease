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

    // Today boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Yesterday boundaries
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Today's orders
    const todayOrders = await Order.count({
      where: {
        tenant_id,
        createdAt: { [Op.gte]: today, [Op.lt]: tomorrow }
      }
    });

    // Yesterday's orders
    const yesterdayOrders = await Order.count({
      where: {
        tenant_id,
        createdAt: { [Op.gte]: yesterday, [Op.lt]: today }
      }
    });

    // Today's revenue
    const todayRevenue = await Order.sum('total_amount', {
      where: {
        tenant_id,
        status: { [Op.ne]: 'cancelled' },
        createdAt: { [Op.gte]: today, [Op.lt]: tomorrow }
      }
    }) || 0;

    // Yesterday's revenue
    const yesterdayRevenue = await Order.sum('total_amount', {
      where: {
        tenant_id,
        status: { [Op.ne]: 'cancelled' },
        createdAt: { [Op.gte]: yesterday, [Op.lt]: today }
      }
    }) || 0;

    // Today's expenses
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayExpenses = await Expense.sum('amount', {
      where: { tenant_id, expense_date: todayStr }
    }) || 0;

    // Pending orders
    const pendingOrders = await Order.count({
      where: { tenant_id, status: 'pending' }
    });

    // Preparing orders
    const preparingOrders = await Order.count({
      where: { tenant_id, status: 'preparing' }
    });

    // Total revenue (all time)
    const totalRevenue = await Order.sum('total_amount', {
      where: {
        tenant_id,
        status: { [Op.ne]: 'cancelled' }
      }
    }) || 0;

    // Compute trend percentages
    const calcTrend = (current, previous) => {
      if (previous === 0 && current === 0) return { value: 0, direction: 'up' };
      if (previous === 0) return { value: 100, direction: 'up' };
      const pct = Math.round(((current - previous) / previous) * 100);
      return { value: Math.abs(pct), direction: pct >= 0 ? 'up' : 'down' };
    };

    const revenueTrend = calcTrend(todayRevenue, yesterdayRevenue);
    const ordersTrend = calcTrend(todayOrders, yesterdayOrders);

    // Tables occupancy trend — compare to 50% baseline
    const occupancyPct = totalTables > 0 ? Math.round(((totalTables - availableTables) / totalTables) * 100) : 0;
    const occupancyTrend = { value: occupancyPct > 50 ? occupancyPct - 50 : 50 - occupancyPct, direction: occupancyPct >= 50 ? 'up' : 'down' };

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
          today: todayRevenue,
          total: totalRevenue
        },
        expenses: {
          today: todayExpenses,
        },
        profit: {
          today: todayRevenue - todayExpenses,
        },
        trends: {
          revenue: revenueTrend,
          orders: ordersTrend,
          staff: { value: totalStaff, direction: 'up' },
          tables: occupancyTrend,
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
