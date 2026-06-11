const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  price_id: { type: DataTypes.INTEGER },
  category_id: { type: DataTypes.INTEGER },
  name: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.CHAR(1) },
  manufacturing_date: { type: DataTypes.DATE },
  expiration_date: { type: DataTypes.DATE },
  height: { type: DataTypes.REAL },
  manufacturing_place: { type: DataTypes.TEXT },
  weight: { type: DataTypes.REAL },
  description: { type: DataTypes.TEXT },
  presentation: { type: DataTypes.TEXT }
}, { tableName: 'products', timestamps: false });

module.exports = Product;