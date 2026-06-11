const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  shopping_car_id: { type: DataTypes.INTEGER, unique: true },
  delivery_address_id: { type: DataTypes.INTEGER },
  customer_id: { type: DataTypes.INTEGER },
  total_base: { type: DataTypes.REAL },
  iva: { type: DataTypes.DECIMAL },
  total_amount: { type: DataTypes.REAL },
  delivery: { type: DataTypes.BOOLEAN },
  amount_delivery: { type: DataTypes.DECIMAL }
}, { tableName: 'orders', timestamps: false });

module.exports = Order;