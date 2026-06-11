const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  max_stock: { type: DataTypes.INTEGER },
  min_stock: { type: DataTypes.INTEGER }
}, { tableName: 'inventory', timestamps: false });

module.exports = Inventory;