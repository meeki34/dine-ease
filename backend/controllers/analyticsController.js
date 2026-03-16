const { Expense, Order } = require('../models/index');
const { Op, fn, col, literal } = require('sequelize');

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

    const [ordersByDay, expensesByDay, expensesByCategory, recentExpenses] = await Promise.all([
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
    ]);

    const revenueMap = new Map(
      (ordersByDay || []).map((r) => [String(r.date), Number(r.revenue || 0)])
    );
    const expenseMap = new Map(
      (expensesByDay || []).map((r) => [String(r.expense_date), Number(r.expenses || 0)])
    );

    const daysList = enumerateDays(fromDate, toDate);
    const series = daysList.map((date) => {
      const revenue = revenueMap.get(date) || 0;
      const expenses = expenseMap.get(date) || 0;
      return { date, revenue, expenses, profit: revenue - expenses };
    });

    const revenueTotal = series.reduce((s, d) => s + Number(d.revenue || 0), 0);
    const expensesTotal = series.reduce((s, d) => s + Number(d.expenses || 0), 0);
    const profitTotal = revenueTotal - expensesTotal;

    return res.json({
      success: true,
      data: {
        range: { from: fromStr, to: toStr },
        totals: { revenue: revenueTotal, expenses: expensesTotal, profit: profitTotal },
        byDay: series,
        expensesByCategory: (expensesByCategory || []).map((c) => ({
          category: c.category || 'Other',
          amount: Number(c.amount || 0),
        })),
        recentExpenses,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

