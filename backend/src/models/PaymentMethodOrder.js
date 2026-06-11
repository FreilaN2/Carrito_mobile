const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentMethodOrder = sequelize.define('PaymentMethodOrder', {
  order_id: { type: DataTypes.INTEGER, primaryKey: true },
  payment_method_id: { type: DataTypes.INTEGER, primaryKey: true },
  date: { type: DataTypes.DATE }
}, { tableName: 'payment_methods_orders', timestamps: false });

module.exports = PaymentMethodOrder;