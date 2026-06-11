const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethod = sequelize.define('PaymentMethod', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.TEXT },
  method: { type: DataTypes.TEXT },
  bank_account: { type: DataTypes.TEXT },
  cedula: { type: DataTypes.TEXT },
  account_holder: { type: DataTypes.TEXT },
  cellphone_number: { type: DataTypes.TEXT },
  email: { type: DataTypes.TEXT },
  currency: { type: DataTypes.TEXT }
}, { tableName: 'payment_methods', timestamps: false });

module.exports = PaymentMethod;