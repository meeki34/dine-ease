const { Table } = require('../models/index');

// @desc    Get all tables
// @route   GET /api/tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.findAll({
      where: { tenant_id: req.user.tenant_id },
      order: [['table_number', 'ASC']]
    });
    res.json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create table
// @route   POST /api/tables
exports.createTable = async (req, res) => {
  try {
    const { table_number, capacity, location, status } = req.body;

    const num = Number(table_number);
    if (!Number.isFinite(num) || num <= 0) {
      return res.status(400).json({ success: false, message: 'Table number is invalid' });
    }

    const cap = capacity === undefined ? undefined : Number(capacity);
    if (cap !== undefined && (!Number.isFinite(cap) || cap <= 0)) {
      return res.status(400).json({ success: false, message: 'Capacity is invalid' });
    }

    const allowedStatuses = ['available', 'occupied', 'reserved', 'cleaning'];
    const nextStatus = status === undefined ? undefined : String(status);
    if (nextStatus !== undefined && !allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ success: false, message: 'Status is invalid' });
    }

    // Check if table number exists
    const tableExists = await Table.findOne({
      where: { 
        tenant_id: req.user.tenant_id,
        table_number: num,
      }
    });

    if (tableExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Table number already exists' 
      });
    }

    const table = await Table.create({
      tenant_id: req.user.tenant_id,
      table_number: num,
      capacity: cap,
      location: location ? String(location).trim() : null,
      status: nextStatus,
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update table status
// @route   PUT /api/tables/:id
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.user.tenant_id 
      }
    });

    if (!table) {
      return res.status(404).json({ 
        success: false, 
        message: 'Table not found' 
      });
    }

    await table.update(req.body);
    res.json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.user.tenant_id 
      }
    });

    if (!table) {
      return res.status(404).json({ 
        success: false, 
        message: 'Table not found' 
      });
    }

    await table.destroy();
    res.json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
