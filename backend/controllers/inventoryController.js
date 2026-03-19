const { Ingredient, InventoryTransaction } = require('../models/index');
const { Op } = require('sequelize');
const { emitUpdate } = require('../utils/socket');
const { checkAndAutoDraftPOs } = require('./poController');

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

// @desc    List ingredients (optionally only low stock)
// @route   GET /api/inventory/ingredients
exports.listIngredients = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const where = { tenant_id, is_active: true };
    const onlyLow = String(req.query.onlyLow || '').toLowerCase() === 'true';
    if (onlyLow) {
      where.current_quantity = { [Op.lte]: Ingredient.sequelize.col('low_stock_threshold') };
    }

    const ingredients = await Ingredient.findAll({
      where,
      order: [['name', 'ASC']],
    });

    res.json({ success: true, count: ingredients.length, data: ingredients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create ingredient
// @route   POST /api/inventory/ingredients
exports.createIngredient = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const { name, unit, current_quantity, low_stock_threshold } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const ingredient = await Ingredient.create({
      tenant_id,
      name: String(name).trim(),
      unit: String(unit || 'pcs').trim(),
      current_quantity: Number.isFinite(num(current_quantity)) ? num(current_quantity) : 0,
      low_stock_threshold: Number.isFinite(num(low_stock_threshold)) ? num(low_stock_threshold) : 0,
      is_active: true,
    });

    res.status(201).json({ success: true, data: ingredient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update ingredient
// @route   PUT /api/inventory/ingredients/:id
exports.updateIngredient = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const ingredient = await Ingredient.findOne({ where: { id: req.params.id, tenant_id } });
    if (!ingredient) return res.status(404).json({ success: false, message: 'Ingredient not found' });

    const { name, unit, low_stock_threshold } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = String(name).trim();
    if (unit !== undefined) patch.unit = String(unit).trim();
    if (low_stock_threshold !== undefined) {
      const t = num(low_stock_threshold);
      if (!Number.isFinite(t) || t < 0) return res.status(400).json({ success: false, message: 'Invalid threshold' });
      patch.low_stock_threshold = t;
    }

    await ingredient.update(patch);
    res.json({ success: true, data: ingredient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deactivate ingredient
// @route   DELETE /api/inventory/ingredients/:id
exports.deleteIngredient = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const ingredient = await Ingredient.findOne({ where: { id: req.params.id, tenant_id } });
    if (!ingredient) return res.status(404).json({ success: false, message: 'Ingredient not found' });

    await ingredient.update({ is_active: false });
    res.json({ success: true, message: 'Ingredient deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Adjust ingredient stock and log transaction
// @route   POST /api/inventory/ingredients/:id/adjust
exports.adjustIngredient = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const ingredient = await Ingredient.findOne({ where: { id: req.params.id, tenant_id, is_active: true } });
    if (!ingredient) return res.status(404).json({ success: false, message: 'Ingredient not found' });

    const { type, quantity, note } = req.body;
    if (!['in', 'out', 'adjust'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    const q = num(quantity);
    if (!Number.isFinite(q) || q <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be > 0' });
    }

    const before = Number(ingredient.current_quantity || 0);
    const delta = type === 'in' ? q : type === 'out' ? -q : q - before;
    const after = before + delta;

    if (after < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot go below 0' });
    }

    await ingredient.update({ current_quantity: after });

    const tx = await InventoryTransaction.create({
      tenant_id,
      ingredient_id: ingredient.id,
      type,
      quantity: q,
      note: note ? String(note).trim() : null,
      created_by: req.user.id,
      before_quantity: before,
      after_quantity: after,
    });

    if (after <= ingredient.low_stock_threshold) {
      emitUpdate(tenant_id, 'inventory_update', { 
        ingredient_id: ingredient.id, 
        name: ingredient.name, 
        level: after, 
        threshold: ingredient.low_stock_threshold 
      });
      // Trigger Auto-Draft
      checkAndAutoDraftPOs(tenant_id);
    }

    res.status(201).json({ success: true, data: { ingredient, transaction: tx } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    List inventory transactions
// @route   GET /api/inventory/transactions
exports.listTransactions = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const where = { tenant_id };
    if (req.query.ingredient_id) where.ingredient_id = req.query.ingredient_id;

    const list = await InventoryTransaction.findAll({
      where,
      include: [{ model: Ingredient }],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

