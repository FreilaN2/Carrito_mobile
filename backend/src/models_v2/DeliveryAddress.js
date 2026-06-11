const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryAddress = sequelize.define('DeliveryAddress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  address: { type: DataTypes.TEXT },
  city: { type: DataTypes.TEXT },
  parish: { type: DataTypes.TEXT },
  municipality: { type: DataTypes.TEXT },
  state: { type: DataTypes.TEXT },
  country: { type: DataTypes.TEXT },
  zip_code: { type: DataTypes.INTEGER },
  telephone_number: { type: DataTypes.TEXT }
}, { tableName: 'delivery_address', timestamps: false });

module.exports = DeliveryAddress;