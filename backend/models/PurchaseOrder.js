const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const PurchaseOrder = sequelize.define(
  'PurchaseOrder',
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
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    po_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'received', 'cancelled'),
      defaultValue: 'draft',
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    expected_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    received_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['tenant_id', 'status'] },
      { fields: ['supplier_id'] },
      { fields: ['po_number'] },
    ],
  }
);

module.exports = PurchaseOrder;
