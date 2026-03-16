const { Tenant, User } = require('../models/index');
const bcrypt = require('bcryptjs');

// @desc    Get all tenants
// @route   GET /api/superadmin/tenants
exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      include: [{
        model: User,
        attributes: { exclude: ['password'] }
      }]
    });
    res.json({ success: true, count: tenants.length, data: tenants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Activate/Deactivate tenant
// @route   PUT /api/superadmin/tenants/:id
exports.updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);

    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
    }

    await tenant.update(req.body);
    res.json({ success: true, data: tenant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete tenant
// @route   DELETE /api/superadmin/tenants/:id
exports.deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);

    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
    }

    await tenant.destroy();
    res.json({ success: true, message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all stats across all tenants
// @route   GET /api/superadmin/stats
exports.getStats = async (req, res) => {
  try {
    const totalTenants = await Tenant.count();
    const activeTenants = await Tenant.count({ where: { is_active: true } });
    const totalUsers = await User.count();

    res.json({
      success: true,
      data: {
        tenants: {
          total: totalTenants,
          active: activeTenants,
          inactive: totalTenants - activeTenants
        },
        users: {
          total: totalUsers
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};