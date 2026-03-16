const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const InventoryTransaction = sequelize.define(
  'InventoryTransaction',
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
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      // in | out | adjust
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [['in', 'out', 'adjust']] },
    },
    quantity: {
      // positive number entered by user; for 'out', we subtract
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    before_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    after_quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['ingredient_id'] },
      { fields: ['created_by'] },
      { fields: ['createdAt'] },
    ],
  }
);

module.exports = InventoryTransaction;

