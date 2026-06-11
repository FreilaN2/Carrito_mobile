const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Price = sequelize.define('Price', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  base_amount: { type: DataTypes.REAL, allowNull: false },
  iva: { type: DataTypes.DECIMAL, defaultValue: 0.16 },
  igtf: { type: DataTypes.DECIMAL },
  total_amount: { type: DataTypes.REAL },
  discount: { type: DataTypes.DECIMAL }
}, { tableName: 'prices', timestamps: false });

module.exports = Price;