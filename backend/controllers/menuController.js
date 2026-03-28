const path = require('path');
const multer = require('multer');
const { MenuItem } = require('../models/index');
const { emitUpdate } = require('../utils/socket');

// Multer config for menu item images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'menu'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `menu-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.split('/')[1]);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

exports.uploadMiddleware = upload.single('image');

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

    // Use uploaded file path or provided URL
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/menu/${req.file.filename}`;
    }

    const item = await MenuItem.create({
      tenant_id: req.user.tenant_id,
      name: String(name).trim(),
      description: description ? String(description).trim() : null,
      price: p,
      category: String(category).trim(),
      is_available: is_available === undefined ? true : Boolean(is_available),
      image_url: finalImageUrl,
      dietary_tags: dietary_tags || '',
      is_special: Boolean(is_special)
    });

    emitUpdate(req.user.tenant_id, 'menu_updated');

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

    // If a new file was uploaded, update the image_url
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image_url = `/uploads/menu/${req.file.filename}`;
    }

    await item.update(updateData);
    emitUpdate(req.user.tenant_id, 'menu_updated');
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
    emitUpdate(req.user.tenant_id, 'menu_updated');
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
