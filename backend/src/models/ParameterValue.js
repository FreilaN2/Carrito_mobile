const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ParameterValue = sequelize.define('ParameterValue', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.TEXT, primaryKey: true },
  value: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.BOOLEAN }
}, { tableName: 'parameters_values', timestamps: false });

module.exports = ParameterValue;