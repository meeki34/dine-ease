const bcrypt = require('bcryptjs');
const { User } = require('../models/index');

// @desc    Get all staff
// @route   GET /api/staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.findAll({
      where: { tenant_id: req.user.tenant_id },
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, count: staff.length, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add staff member
// @route   POST /api/staff
exports.addStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      tenant_id: req.user.tenant_id,
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ 
      success: true, 
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
exports.updateStaff = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.user.tenant_id 
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff member not found' 
      });
    }

    await user.update(req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deactivate staff member
// @route   DELETE /api/staff/:id
exports.deactivateStaff = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { 
        id: req.params.id,
        tenant_id: req.user.tenant_id 
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff member not found' 
      });
    }

    await user.update({ is_active: false });
    res.json({ success: true, message: 'Staff member deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
