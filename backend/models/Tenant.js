const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            name: 'tenant_email_unique',
            fields: ['email']
        }
    ]
});

module.exports = Tenant;