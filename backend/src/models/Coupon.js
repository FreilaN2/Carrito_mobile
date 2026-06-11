const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER },
  type: { type: DataTypes.TEXT },
  amount_discount: { type: DataTypes.REAL },
  percent_discount: { type: DataTypes.DECIMAL }
}, { tableName: 'coupons', timestamps: false });

module.exports = Coupon;