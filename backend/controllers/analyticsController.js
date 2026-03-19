const { sequelize, Expense, Order, DailyLog, OrderItem, MenuItem, Ingredient, Recipe, EmployeePerformance, Shift, User } = require('../models/index');
const { Op, fn, col, literal } = require('sequelize');
const { emitUpdate } = require('../utils/socket');

const clampDays = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 30;
  return Math.max(1, Math.min(365, Math.floor(n)));
};

const toISODate = (d) => d.toISOString().slice(0, 10);

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfDay = (d) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

const enumerateDays = (fromDate, toDate) => {
  const days = [];
  const d = startOfDay(fromDate);
  const end = startOfDay(toDate).getTime();
  while (d.getTime() <= end) {
    days.push(toISODate(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
};

// @desc    Analytics summary (cash flow)
// @route   GET /api/analytics
// Query: ?days=7 OR ?from=YYYY-MM-DD&to=YYYY-MM-DD
exports.getAnalytics = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;

    const now = new Date();
    const days = clampDays(req.query.days);

    let fromStr = req.query.from ? String(req.query.from) : null;
    let toStr = req.query.to ? String(req.query.to) : null;

    if (!fromStr || !toStr) {
      const to = startOfDay(now);
      const from = new Date(to);
      from.setDate(from.getDate() - (days - 1));
      fromStr = toISODate(from);
      toStr = toISODate(to);
    }

    const fromDate = startOfDay(new Date(`${fromStr}T00:00:00`));
    const toDate = endOfDay(new Date(`${toStr}T00:00:00`));

    const orderWhere = {
      tenant_id,
      status: { [Op.ne]: 'cancelled' },
      createdAt: { [Op.between]: [fromDate, toDate] },
    };

    const expenseWhere = {
      tenant_id,
      expense_date: { [Op.between]: [fromStr, toStr] },
    };

    const logWhere = {
      tenant_id,
      log_date: { [Op.between]: [fromStr, toStr] },
    };

    const [
      ordersByDay, 
      expensesByDay, 
      expensesByCategory, 
      recentExpenses, 
      dailyLogs,
      topItems,
      hourlyDistribution,
      fullOrders,
      lowStockIngredients,
      performance,
      completedShifts
    ] = await Promise.all([
      Order.findAll({
        where: orderWhere,
        attributes: [[fn('DATE', col('createdAt')), 'date'], [fn('SUM', col('total_amount')), 'revenue']],
        group: [literal('DATE(createdAt)')],
        order: [[literal('DATE(createdAt)'), 'ASC']],
        raw: true,
      }),
      Expense.findAll({
        where: expenseWhere,
        attributes: ['expense_date', [fn('SUM', col('amount')), 'expenses']],
        group: ['expense_date'],
        order: [['expense_date', 'ASC']],
        raw: true,
      }),
      Expense.findAll({
        where: expenseWhere,
        attributes: ['category', [fn('SUM', col('amount')), 'amount']],
        group: ['category'],
        order: [[fn('SUM', col('amount')), 'DESC']],
        limit: 8,
        raw: true,
      }),
      Expense.findAll({
        where: { tenant_id },
        order: [['expense_date', 'DESC'], ['id', 'DESC']],
        limit: 12,
        raw: true,
      }),
      DailyLog.findAll({
        where: logWhere,
        raw: true
      }),
      OrderItem.findAll({
        attributes: [
          [col('MenuItem.name'), 'name'],
          [fn('SUM', col('quantity')), 'count']
        ],
        include: [{
          model: Order,
          where: orderWhere,
          attributes: []
        }, {
          model: MenuItem,
          attributes: []
        }],
        group: ['MenuItem.id', 'MenuItem.name'],
        order: [[fn('SUM', col('quantity')), 'DESC']],
        limit: 5,
        raw: true
      }),
      Order.findAll({
        attributes: [
          [fn('HOUR', col('Order.createdAt')), 'hour'],
          [fn('COUNT', col('Order.id')), 'count']
        ],
        where: orderWhere,
        group: [literal('HOUR(Order.createdAt)')],
        raw: true
      }),
      Order.findAll({
        where: orderWhere,
        include: [{
          model: OrderItem,
          include: [{
            model: MenuItem,
            include: [{
              model: Recipe,
              include: [Ingredient]
            }]
          }]
        }],
        order: [['createdAt', 'ASC']]
      }),
      Ingredient.findAll({
        where: {
          tenant_id,
          current_quantity: { [Op.lte]: col('low_stock_threshold') },
          is_active: true
        },
        raw: true
      }),
      EmployeePerformance.findAll({
        where: {
          tenant_id,
          end_time: { [Op.ne]: null },
          createdAt: { [Op.between]: [fromDate, toDate] }
        },
        include: [{ model: User, attributes: ['name', 'role'] }],
        attributes: [
            'user_id',
            'role',
            [fn('AVG', sequelize.literal('TIMESTAMPDIFF(SECOND, start_time, end_time)')), 'avg_seconds'],
            [fn('COUNT', col('EmployeePerformance.id')), 'order_count']
        ],
        group: ['user_id', 'EmployeePerformance.role', 'User.id'],
        raw: true,
        nest: true
      }),
      Shift.findAll({
        where: {
          tenant_id,
          status: 'completed',
          start_time: { [Op.between]: [fromDate, toDate] }
        },
        include: [{ model: User, attributes: ['hourly_wage'] }],
        raw: true,
        nest: true
      })
    ]);

    // Calculate daily metrics including COGS
    const dailyAnalytics = new Map();
    fullOrders.forEach(order => {
      const date = toISODate(order.createdAt);
      if (!dailyAnalytics.has(date)) dailyAnalytics.set(date, { revenue: 0, cogs: 0 });
      
      const dayData = dailyAnalytics.get(date);
      dayData.revenue += Number(order.total_amount || 0);
      
      order.OrderItems?.forEach(item => {
        item.MenuItem?.Recipes?.forEach(recipe => {
          const cost = Number(recipe.quantity_required || 0) * Number(recipe.Ingredient?.last_purchase_price || 0);
          dayData.cogs += cost * Number(item.quantity || 0);
        });
      });
    });

    const revenueMap = new Map(
      (ordersByDay || []).map((r) => [String(r.date), Number(r.revenue || 0)])
    );
    const expenseMap = new Map(
      (expensesByDay || []).map((r) => [String(r.expense_date), Number(r.expenses || 0)])
    );
    const logMap = new Map(
      (dailyLogs || []).map((l) => [String(l.log_date), l])
    );

    // Daily labor cost from completed shifts (attribute to start_time day)
    const laborMap = new Map();
    (completedShifts || []).forEach((shift) => {
      const start = new Date(shift.start_time);
      const end = new Date(shift.end_time);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
      if (end.getTime() <= start.getTime()) return;

      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const wage = Number(shift.User?.hourly_wage || 0);
      const cost = hours * (Number.isFinite(wage) ? wage : 0);
      if (!Number.isFinite(cost) || cost <= 0) return;

      const day = toISODate(start);
      laborMap.set(day, (laborMap.get(day) || 0) + cost);
    });

    const daysList = enumerateDays(fromDate, toDate);
    const series = daysList.map((date) => {
      const dayMetrics = dailyAnalytics.get(date) || { revenue: 0, cogs: 0 };
      const expenses = expenseMap.get(date) || 0;
      const labor = laborMap.get(date) || 0;
      const log = logMap.get(date) || {};
      return { 
        date, 
        revenue: dayMetrics.revenue,
        cogs: dayMetrics.cogs,
        expenses, 
        labor,
        profit: dayMetrics.revenue - dayMetrics.cogs - expenses - labor,
        guests: log.guest_count || 0,
        wastage: log.wastage_count || 0,
      };
    });

    const revenueTotal = series.reduce((s, d) => s + Number(d.revenue || 0), 0);
    const cogsTotal = series.reduce((s, d) => s + Number(d.cogs || 0), 0);
    const expensesTotal = series.reduce((s, d) => s + Number(d.expenses || 0), 0);
    const laborTotal = series.reduce((s, d) => s + Number(d.labor || 0), 0);

    const profitTotal = revenueTotal - cogsTotal - expensesTotal - laborTotal;
    
    // Derived Metrics
    const completedOrders = await Order.count({ where: orderWhere });
    const avgCheck = completedOrders > 0 ? revenueTotal / completedOrders : 0;

    return res.json({
      success: true,
      data: {
        range: { from: fromStr, to: toStr },
        totals: { 
          revenue: revenueTotal, 
          cogs: cogsTotal,
          expenses: expensesTotal, 
          labor: laborTotal,
          profit: profitTotal,
          avgCheck: avgCheck,
          orderCount: completedOrders
        },
        byDay: series,
        performance,
        topItems: (topItems || []).map(i => ({ name: i.name || 'Unknown', count: Number(i.count || 0) })),
        heatmap: (hourlyDistribution || []).map(h => ({ hour: Number(h.hour), count: Number(h.count) })),
        expensesByCategory: (expensesByCategory || []).map((c) => ({
          category: c.category || 'Other',
          amount: Number(c.amount || 0),
        })),
        recentExpenses,
        lowStock: (lowStockIngredients || []).map(i => ({
          id: i.id,
          name: i.name,
          unit: i.unit,
          current_quantity: Number(i.current_quantity),
          low_stock_threshold: Number(i.low_stock_threshold)
        }))
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upsert daily operational log
// @route   POST /api/analytics/log
exports.recordDailyLog = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const { log_date, guest_count, wastage_count, notes } = req.body;

    if (!log_date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    // Upsert logic
    const [log, created] = await DailyLog.findOrCreate({
      where: { tenant_id, log_date },
      defaults: {
        guest_count: guest_count || 0,
        wastage_count: wastage_count || 0,
        notes: notes || ''
      }
    });

    if (!created) {
      await log.update({
        guest_count: guest_count !== undefined ? guest_count : log.guest_count,
        wastage_count: wastage_count !== undefined ? wastage_count : log.wastage_count,
        notes: notes !== undefined ? notes : log.notes
      });
    }

    emitUpdate(tenant_id, 'analytics_update');
 
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
