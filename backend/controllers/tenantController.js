const { Tenant, User } = require('../models');
const bcrypt = require('bcryptjs');

// @desc    Update tenant settings (profile, currency, timezone, notifications)
// @route   PUT /api/tenant/settings
exports.updateSettings = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { currency, name, email, phone, address, timezone, notification_prefs } = req.body;

        if (!tenant_id) {
            return res.status(400).json({ status: 'fail', message: 'No tenant associated with this user.' });
        }

        const tenant = await Tenant.findByPk(tenant_id);
        if (!tenant) {
            return res.status(404).json({ status: 'fail', message: 'Tenant not found' });
        }

        if (currency) tenant.currency = currency;
        if (name) tenant.name = name;
        if (email) tenant.email = email;
        if (phone !== undefined) tenant.phone = phone;
        if (address !== undefined) tenant.address = address;

        await tenant.save();

        res.status(200).json({
            status: 'success',
            data: tenant
        });
    } catch (error) {
        console.error('Tenant update error:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
};

// @desc    Change user password
// @route   PUT /api/tenant/password
exports.changePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({ success: false, message: 'Current and new password are required' });
        }

        if (new_password.length < 8) {
            return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
        }

        // Get user with password
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        await user.update({ password: hashedPassword });

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get tenant profile
// @route   GET /api/tenant/profile
exports.getProfile = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const tenant = await Tenant.findByPk(tenant_id);
        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Tenant not found' });
        }
        res.json({ success: true, data: tenant });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
