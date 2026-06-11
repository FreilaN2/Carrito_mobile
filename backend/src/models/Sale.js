const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sale = sequelize.define('Sale', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.TEXT },
  percent: { type: DataTypes.DECIMAL },
  status: { type: DataTypes.CHAR(1) }
}, { tableName: 'sales', timestamps: false });

module.exports = Sale;