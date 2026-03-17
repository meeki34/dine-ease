const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DailyLog = sequelize.define('DailyLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  log_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  guest_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wastage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['tenant_id', 'log_date']
    }
  ]
});

module.exports = DailyLog;
