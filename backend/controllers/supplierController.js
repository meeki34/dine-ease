const { Supplier, Ingredient } = require('../models/index');

// @desc    Get all suppliers
// @route   GET /api/suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const suppliers = await Supplier.findAll({
      where: { tenant_id },
      include: [{ model: Ingredient, attributes: ['id', 'name'] }]
    });
    res.json({ success: true, count: suppliers.length, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
exports.createSupplier = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const { name, contact_name, email, phone, address, payment_terms } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const supplier = await Supplier.create({
      tenant_id,
      name,
      contact_name,
      email,
      phone,
      address,
      payment_terms,
      created_by: req.user.id
    });

    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
exports.updateSupplier = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, tenant_id }
    });

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    await supplier.update(req.body);
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
exports.deleteSupplier = async (req, res) => {
  try {
    const tenant_id = req.user.tenant_id;
    const supplier = await Supplier.findOne({
      where: { id: req.params.id, tenant_id }
    });

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    // Check if supplier is linked to any ingredients
    const linkedIngredients = await Ingredient.count({
      where: { preferred_supplier_id: req.params.id }
    });

    if (linkedIngredients > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete supplier linked to ingredients. Unlink them first.' 
      });
    }

    await supplier.destroy();
    res.json({ success: true, message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
