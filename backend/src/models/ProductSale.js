const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductSale = sequelize.define('ProductSale', {
  product_id: { type: DataTypes.INTEGER, primaryKey: true },
  sale_id: { type: DataTypes.INTEGER, primaryKey: true },
  created_date: { type: DataTypes.DATE },
  expiration_date: { type: DataTypes.DATE }
}, { tableName: 'products_sales', timestamps: false });

module.exports = ProductSale;