const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  table_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'reserved', 'cleaning'),
    defaultValue: 'available'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Table;