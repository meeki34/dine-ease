const { PurchaseOrder, PurchaseOrderItem, Ingredient, Supplier, InventoryTransaction, sequelize } = require('../models/index');
const { Op } = require('sequelize');

// @desc    Get all POs
// @route   GET /api/pos
exports.getPOs = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const pos = await PurchaseOrder.findAll({
      where: { tenant_id },
      include: [
        { model: Supplier, attributes: ['name'] },
        { model: PurchaseOrderItem, include: [Ingredient] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create PO manually
// @route   POST /api/pos
exports.createPO = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const tenant_id = req.user.tenant_id;
    const { supplier_id, items, notes, expected_date } = req.body;

    if (!supplier_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Supplier and items are required' });
    }

    const po_number = `PO-${Date.now()}`;

    const po = await PurchaseOrder.create({
      tenant_id,
      supplier_id,
      po_number,
      notes,
      expected_date,
      created_by: req.user.id
    }, { transaction: t });

    let total = 0;
    for (const item of items) {
      const lineTotal = Number(item.quantity) * Number(item.unit_price);
      await PurchaseOrderItem.create({
        po_id: po.id,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: lineTotal
      }, { transaction: t });
      total += lineTotal;
    }

    await po.update({ total_amount: total }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, data: po });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Utility: Generate Draft POs for Low Stock
// This function will be called internally when inventory updates
exports.checkAndAutoDraftPOs = async (tenant_id) => {
  try {
    // 1. Find all low-stock ingredients with a preferred supplier
    const lowStockItems = await Ingredient.findAll({
      where: {
        tenant_id,
        current_quantity: { [Op.lte]: sequelize.col('low_stock_threshold') },
        preferred_supplier_id: { [Op.ne]: null },
        is_active: true
      }
    });

    if (lowStockItems.length === 0) return;

    // 2. Group by supplier
    const itemsBySupplier = {};
    lowStockItems.forEach(item => {
      if (!itemsBySupplier[item.preferred_supplier_id]) {
        itemsBySupplier[item.preferred_supplier_id] = [];
      }
      itemsBySupplier[item.preferred_supplier_id].push(item);
    });

    // 3. Create Draft PO for each supplier
    for (const supplier_id in itemsBySupplier) {
      // Check if there's already a 'draft' PO for this supplier
      const existingDraft = await PurchaseOrder.findOne({
        where: { tenant_id, supplier_id, status: 'draft' }
      });

      if (existingDraft) {
        // Add items to existing draft
        for (const item of itemsBySupplier[supplier_id]) {
          const [poItem, created] = await PurchaseOrderItem.findOrCreate({
            where: { po_id: existingDraft.id, ingredient_id: item.id },
            defaults: {
              quantity: item.low_stock_threshold * 2, // Default reorder quantity
              unit_price: item.last_purchase_price || 0,
              total_price: (item.low_stock_threshold * 2) * (item.last_purchase_price || 0)
            }
          });
          // Update total amount
          const lineTotal = (item.low_stock_threshold * 2) * (item.last_purchase_price || 0);
          await existingDraft.update({
            total_amount: Number(existingDraft.total_amount) + lineTotal
          });
        }
      } else {
        // Create new draft
        const t = await sequelize.transaction();
        try {
          const po = await PurchaseOrder.create({
            tenant_id,
            supplier_id,
            po_number: `AUTO-${Date.now()}`,
            status: 'draft',
            notes: 'Automatically generated due to low stock'
          }, { transaction: t });

          let total = 0;
          for (const item of itemsBySupplier[supplier_id]) {
            const qty = item.low_stock_threshold * 2 || 10;
            const price = item.last_purchase_price || 0;
            await PurchaseOrderItem.create({
              po_id: po.id,
              ingredient_id: item.id,
              quantity: qty,
              unit_price: price,
              total_price: qty * price
            }, { transaction: t });
            total += (qty * price);
          }
          await po.update({ total_amount: total }, { transaction: t });
          await t.commit();
        } catch (err) {
          await t.rollback();
          console.error('Auto-Draft Error:', err);
        }
      }
    }
  } catch (error) {
    console.error('checkAndAutoDraftPOs failed:', error);
  }
};

// @desc    Update PO status (e.g., mark as Received)
// @route   PUT /api/pos/:id/status
exports.updatePOStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const tenant_id = req.user.tenant_id;
    const { status } = req.body;
    const po = await PurchaseOrder.findOne({
      where: { id: req.params.id, tenant_id },
      include: [PurchaseOrderItem]
    });

    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });

    const oldStatus = po.status;
    await po.update({ status }, { transaction: t });

    // If marked as received, increase inventory
    if (status === 'received' && oldStatus !== 'received') {
      for (const item of po.PurchaseOrderItems) {
        const ingredient = await Ingredient.findByPk(item.ingredient_id, { transaction: t });
        if (ingredient) {
          await ingredient.update({
            current_quantity: Number(ingredient.current_quantity) + Number(item.quantity),
            last_purchase_price: item.unit_price
          }, { transaction: t });
          
          // Log transaction
          await InventoryTransaction.create({
            tenant_id,
            ingredient_id: ingredient.id,
            type: 'in',
            quantity: item.quantity,
            note: `Received from PO: ${po.po_number}`
          }, { transaction: t });
        }
      }
      await po.update({ received_date: new Date() }, { transaction: t });
    }

    await t.commit();
    res.json({ success: true, data: po });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};
