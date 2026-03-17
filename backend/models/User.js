const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'chef',
        validate: {
            isIn: [['superadmin', 'admin', 'manager', 'chef', 'waiter']]
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true
});

module.exports = User;
