const { MenuItem } = require('../models/index');

// @desc    Get all menu items
// @route   GET /api/menu
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.findAll({
      where: { tenant_id: req.user.tenant_id }
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, is_available, image_url, dietary_tags, is_special } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!category || !String(category).trim()) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }
    const p = Number(price);
    if (!Number.isFinite(p) || p < 0) {
      return res.status(400).json({ success: false, message: 'Price is invalid' });
    }

    const item = await MenuItem.create({
      tenant_id: req.user.tenant_id,
      name: String(name).trim(),
      description: description ? String(description).trim() : null,
      price: p,
      category: String(category).trim(),
      is_available: is_available === undefined ? true : Boolean(is_available),
      image_url: image_url || null,
      dietary_tags: dietary_tags || '',
      is_special: Boolean(is_special)
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.user.tenant_id 
      }
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await item.update(req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.user.tenant_id 
      }
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await item.destroy();
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
