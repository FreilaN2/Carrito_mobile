const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShoppingCarProduct = sequelize.define('ShoppingCarProduct', {
  shopping_car_id: { type: DataTypes.INTEGER, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, primaryKey: true },
  amount: { type: DataTypes.REAL },
  total_amount: { type: DataTypes.REAL }
}, { tableName: 'shopping_car_products', timestamps: false });

module.exports = ShoppingCarProduct;