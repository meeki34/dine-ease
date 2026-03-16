const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

// Protect routes
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

// Role based access
exports.allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not authorized`
            });
        }
        next();
    };
};

// Tenant isolation
exports.tenantIsolation = (req, res, next) => {
    if (req.params.tenant_id &&
        req.user.role !== 'superadmin' &&
        req.user.tenant_id !== parseInt(req.params.tenant_id)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied to this tenant'
        });
    }
    next();
};