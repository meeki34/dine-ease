const { Bill, Order, OrderItem, MenuItem, Table, Tenant } = require('../models/index');
const { Op } = require('sequelize');
const { emitUpdate } = require('../utils/socket');

// @desc    Get all bills for the tenant
// @route   GET /api/billing
exports.getBills = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    if (!tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const { status, date } = req.query;
    const where = { tenant_id };

    if (status && status !== 'all') {
      where.payment_status = status;
    }

    if (date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      where.createdAt = { [Op.between]: [dayStart, dayEnd] };
    }

    const bills = await Bill.findAll({
      where,
      include: [{
        model: Order,
        include: [{ model: OrderItem, include: [MenuItem] }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tables with unbilled served orders (for billing page left panel)
// @route   GET /api/billing/tables
exports.getBillableTables = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    if (!tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    // Find all orders that are served but not yet billed
    const unbilledOrders = await Order.findAll({
      where: {
        tenant_id,
        status: 'served',
        bill_id: null
      },
      include: [{ model: OrderItem, include: [MenuItem] }],
      order: [['table_number', 'ASC'], ['createdAt', 'ASC']]
    });

    // Group by table_number
    const tableMap = {};
    for (const order of unbilledOrders) {
      const tblNum = order.table_number;
      if (!tableMap[tblNum]) {
        tableMap[tblNum] = {
          table_number: tblNum,
          orders: [],
          total: 0,
          items_count: 0
        };
      }
      tableMap[tblNum].orders.push(order);
      tableMap[tblNum].total += Number(order.total_amount || 0);
      const count = (order.OrderItems || []).reduce((s, i) => s + Number(i.quantity || 0), 0);
      tableMap[tblNum].items_count += count;
    }

    const tables = Object.values(tableMap);
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate bill for a table (aggregate all unbilled served orders)
// @route   POST /api/billing/generate
exports.generateBill = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    if (!tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const { table_number, tax_rate = 0, discount_amount = 0 } = req.body;

    if (!table_number) {
      return res.status(400).json({ success: false, message: 'Table number is required' });
    }

    // Find unbilled served orders for this table
    const orders = await Order.findAll({
      where: {
        tenant_id,
        table_number: Number(table_number),
        status: 'served',
        bill_id: null
      },
      include: [{ model: OrderItem, include: [MenuItem] }]
    });

    if (orders.length === 0) {
      return res.status(400).json({ success: false, message: 'No unbilled served orders for this table' });
    }

    // Calculate subtotal from all orders
    const subtotal = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const taxAmt = Math.round((subtotal * Number(tax_rate)) / 100 * 100) / 100;
    const discountAmt = Number(discount_amount) || 0;
    const total = Math.round((subtotal + taxAmt - discountAmt) * 100) / 100;

    // Create bill
    const bill = await Bill.create({
      tenant_id,
      table_number: Number(table_number),
      subtotal,
      tax_rate: Number(tax_rate),
      tax_amount: taxAmt,
      discount_amount: discountAmt,
      total: Math.max(total, 0),
      payment_method: 'unpaid',
      payment_status: 'pending',
      created_by: req.user.id
    });

    // Link orders to the bill
    for (const order of orders) {
      await order.update({ bill_id: bill.id });
    }

    // Fetch the complete bill with orders
    const completeBill = await Bill.findByPk(bill.id, {
      include: [{
        model: Order,
        include: [{ model: OrderItem, include: [MenuItem] }]
      }]
    });

    emitUpdate(tenant_id, 'bill_created');

    res.status(201).json({ success: true, data: completeBill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single bill with full breakdown
// @route   GET /api/billing/:id
exports.getBill = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    if (!tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const bill = await Bill.findOne({
      where: { id: req.params.id, tenant_id },
      include: [{
        model: Order,
        include: [{ model: OrderItem, include: [MenuItem] }]
      }]
    });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update bill (tax, tip, discount) before paying
// @route   PUT /api/billing/:id
exports.updateBill = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    if (!tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const bill = await Bill.findOne({ where: { id: req.params.id, tenant_id } });
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    if (bill.payment_status === 'paid') {
      return res.status(400).json({ success: false, message: 'Cannot edit a paid bill' });
    }

    const { tax_rate, tip_amount, discount_amount } = req.body;

    const newTaxRate = tax_rate !== undefined ? Number(tax_rate) : Number(bill.tax_rate);
    const newTip = tip_amount !== undefined ? Number(tip_amount) : Number(bill.tip_amount);
    const newDiscount = discount_amount !== undefined ? Number(discount_amount) : Number(bill.discount_amount);

    const subtotal = Number(bill.subtotal);
    const taxAmt = Math.round((subtotal * newTaxRate) / 100 * 100) / 100;
    const total = Math.max(Math.round((subtotal + taxAmt + newTip - newDiscount) * 100) / 100, 0);

    await bill.update({
      tax_rate: newTaxRate,
      tax_amount: taxAmt,
      tip_amount: newTip,
      discount_amount: newDiscount,
      total
    });

    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pay bill — mark as paid, record method, auto-reset table
// @route   PUT /api/billing/:id/pay
exports.payBill = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    if (!tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const bill = await Bill.findOne({
      where: { id: req.params.id, tenant_id },
      include: [{ model: Order }]
    });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    if (bill.payment_status === 'paid') {
      return res.status(400).json({ success: false, message: 'Bill is already paid' });
    }

    const { payment_method, tip_amount } = req.body;
    const validMethods = ['cash', 'card', 'upi', 'split'];
    if (!payment_method || !validMethods.includes(payment_method)) {
      return res.status(400).json({ success: false, message: 'Valid payment method required (cash, card, upi, split)' });
    }

    // If tip was provided at payment time, recalculate total
    let updateData = {
      payment_method,
      payment_status: 'paid'
    };

    if (tip_amount !== undefined) {
      const newTip = Number(tip_amount) || 0;
      const subtotal = Number(bill.subtotal);
      const taxAmt = Number(bill.tax_amount);
      const discount = Number(bill.discount_amount);
      const total = Math.max(Math.round((subtotal + taxAmt + newTip - discount) * 100) / 100, 0);
      updateData.tip_amount = newTip;
      updateData.total = total;
    }

    await bill.update(updateData);

    // Auto-reset table to available
    await Table.update(
      { status: 'available' },
      { where: { tenant_id, table_number: bill.table_number } }
    );

    // Emit real-time events
    emitUpdate(tenant_id, 'bill_paid');
    emitUpdate(tenant_id, 'table_updated');
    emitUpdate(tenant_id, 'analytics_update');

    res.json({ success: true, data: bill, message: 'Bill paid successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get receipt data for printing
// @route   GET /api/billing/:id/receipt
exports.getReceiptData = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    if (!tenant_id) {
      return res.status(403).json({ success: false, message: 'Tenant context required' });
    }

    const bill = await Bill.findOne({
      where: { id: req.params.id, tenant_id },
      include: [{
        model: Order,
        include: [{ model: OrderItem, include: [MenuItem] }]
      }]
    });

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    // Get restaurant info
    const tenant = await Tenant.findByPk(tenant_id);

    // Flatten all items across orders
    const allItems = [];
    for (const order of bill.Orders || []) {
      for (const item of order.OrderItems || []) {
        const existing = allItems.find(a => a.menu_item_id === item.menu_item_id);
        if (existing) {
          existing.quantity += Number(item.quantity);
          existing.line_total += Number(item.price) * Number(item.quantity);
        } else {
          allItems.push({
            menu_item_id: item.menu_item_id,
            name: item.MenuItem?.name || 'Unknown Item',
            price: Number(item.price),
            quantity: Number(item.quantity),
            line_total: Number(item.price) * Number(item.quantity)
          });
        }
      }
    }

    const receipt = {
      restaurant: {
        name: tenant?.name || 'Restaurant',
        address: tenant?.address || '',
        phone: tenant?.phone || '',
        email: tenant?.email || ''
      },
      bill_number: bill.id,
      table_number: bill.table_number,
      date: bill.createdAt,
      items: allItems,
      subtotal: Number(bill.subtotal),
      tax_rate: Number(bill.tax_rate),
      tax_amount: Number(bill.tax_amount),
      tip_amount: Number(bill.tip_amount),
      discount_amount: Number(bill.discount_amount),
      total: Number(bill.total),
      payment_method: bill.payment_method,
      payment_status: bill.payment_status,
      currency: tenant?.currency || 'INR'
    };

    res.json({ success: true, data: receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
