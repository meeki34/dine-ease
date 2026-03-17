const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Ingredient = sequelize.define(
  'Ingredient',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    unit: {
      // e.g. kg, g, l, pcs
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pcs',
    },
    current_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      defaultValue: 0,
    },
    low_stock_threshold: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'name'] },
      { fields: ['is_active'] },
    ],
  }
);

module.exports = Ingredient;

