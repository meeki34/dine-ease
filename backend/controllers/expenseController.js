const { Expense } = require('../models/index');
const { Op } = require('sequelize');
const { emitUpdate } = require('../utils/socket');

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

// @desc    List expenses
// @route   GET /api/expenses
exports.listExpenses = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const where = { tenant_id };

    const from = req.query.from ? String(req.query.from) : null;
    const to = req.query.to ? String(req.query.to) : null;

    if (from || to) {
      where.expense_date = {};
      if (from) where.expense_date[Op.gte] = from;
      if (to) where.expense_date[Op.lte] = to;
    }

    const list = await Expense.findAll({ where, order: [['expense_date', 'DESC'], ['id', 'DESC']], limit: 200 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create expense
// @route   POST /api/expenses
exports.createExpense = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const { amount, category, description, expense_date } = req.body;

    const a = num(amount);
    if (!Number.isFinite(a) || a <= 0) return res.status(400).json({ success: false, message: 'Amount must be > 0' });
    if (!expense_date) return res.status(400).json({ success: false, message: 'Expense date is required' });

    const exp = await Expense.create({
      tenant_id,
      amount: a,
      category: String(category || 'Other').trim() || 'Other',
      description: description ? String(description).trim() : null,
      expense_date: String(expense_date),
      created_by: req.user.id,
    });

    emitUpdate(tenant_id, 'analytics_update');
 
    res.status(201).json({ success: true, data: exp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
exports.updateExpense = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const exp = await Expense.findOne({ where: { id: req.params.id, tenant_id } });
    if (!exp) return res.status(404).json({ success: false, message: 'Expense not found' });

    const { amount, category, description, expense_date } = req.body;
    const patch = {};

    if (amount !== undefined) {
      const a = num(amount);
      if (!Number.isFinite(a) || a <= 0) return res.status(400).json({ success: false, message: 'Amount must be > 0' });
      patch.amount = a;
    }
    if (category !== undefined) patch.category = String(category || 'Other').trim() || 'Other';
    if (description !== undefined) patch.description = description ? String(description).trim() : null;
    if (expense_date !== undefined) patch.expense_date = String(expense_date);

    await exp.update(patch);
    emitUpdate(tenant_id, 'analytics_update');
    res.json({ success: true, data: exp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const exp = await Expense.findOne({ where: { id: req.params.id, tenant_id } });
    if (!exp) return res.status(404).json({ success: false, message: 'Expense not found' });

    await exp.destroy();
    emitUpdate(tenant_id, 'analytics_update');
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

