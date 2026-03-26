const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models/index');

// Generate JWT Token
const generateToken = (id, role, tenant_id) => {
    return jwt.sign(
        { id, role, tenant_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// @desc    Register new tenant + admin
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { tenant_name, tenant_email, tenant_phone, name, email, password } = req.body;

        // Check if tenant exists
        const tenantExists = await Tenant.findOne({ where: { email: tenant_email } });
        if (tenantExists) {
            return res.status(400).json({ success: false, message: 'Restaurant already registered' });
        }

        // Create tenant
        const tenant = await Tenant.create({
            name: tenant_name,
            email: tenant_email,
            phone: tenant_phone
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user for tenant
        const user = await User.create({
            tenant_id: tenant.id,
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        // Generate token
        const token = generateToken(user.id, user.role, user.tenant_id);

        res.status(201).json({
            success: true,
            message: 'Restaurant registered successfully',
            token,
            user: {
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

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ 
            where: { email },
            include: [{ model: Tenant, attributes: ['id', 'name', 'currency'] }]
        });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if active
        if (!user.is_active) {
            return res.status(401).json({ success: false, message: 'Account is deactivated' });
        }

        // Generate token
        const token = generateToken(user.id, user.role, user.tenant_id);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenant_id: user.tenant_id,
                tenant_name: user.Tenant?.name,
                tenant_currency: user.Tenant?.currency
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Tenant, attributes: ['id', 'name', 'currency'] }]
        });
        
        let userData = user.toJSON();
        if (user.Tenant) {
            userData.tenant_name = user.Tenant.name;
            userData.tenant_currency = user.Tenant.currency;
        }

        res.json({ success: true, user: userData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};