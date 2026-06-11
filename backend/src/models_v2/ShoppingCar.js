const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShoppingCar = sequelize.define('ShoppingCar', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  coupon_id: { type: DataTypes.INTEGER },
  created_date: { type: DataTypes.DATE },
  status: { type: DataTypes.CHAR(1) },
  estimated_total: { type: DataTypes.DOUBLE }
}, { tableName: 'shopping_car', timestamps: false });

module.exports = ShoppingCar;