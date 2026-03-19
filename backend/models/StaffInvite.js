const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const StaffInvite = sequelize.define(
  'StaffInvite',
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
    invited_by_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [['manager', 'chef', 'waiter']] },
    },
    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    token: {
      // Dev-friendly: store plaintext token so admins can copy invite links later.
      // On accept, we clear this field.
      type: DataTypes.STRING,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accepted_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['email'] },
      { fields: ['token_hash'], unique: true },
      { fields: ['expires_at'] },
      { fields: ['used_at'] },
    ],
  }
);

module.exports = StaffInvite;
