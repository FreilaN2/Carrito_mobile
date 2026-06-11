const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billing = sequelize.define('Billing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, unique: true },
  name: { type: DataTypes.TEXT },
  lastname: { type: DataTypes.TEXT },
  address: { type: DataTypes.TEXT },
  city: { type: DataTypes.TEXT },
  parish: { type: DataTypes.TEXT },
  municipality: { type: DataTypes.TEXT },
  state: { type: DataTypes.TEXT },
  country: { type: DataTypes.TEXT },
  zip_code: { type: DataTypes.INTEGER },
  telephone_number: { type: DataTypes.TEXT },
  email: { type: DataTypes.TEXT }
}, { tableName: 'billing', timestamps: false });

module.exports = Billing;