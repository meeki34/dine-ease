const { Tenant } = require('../models');

exports.updateSettings = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { currency } = req.body;

        if (!tenant_id) {
            return res.status(400).json({ status: 'fail', message: 'No tenant associated with this user.' });
        }

        const tenant = await Tenant.findByPk(tenant_id);
        if (!tenant) {
            return res.status(404).json({ status: 'fail', message: 'Tenant not found' });
        }

        if (currency) {
            tenant.currency = currency;
        }

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
