const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductPhoto = sequelize.define('ProductPhoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER },
  format: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  photo: { type: DataTypes.BLOB }
}, { tableName: 'products_photos', timestamps: false });

module.exports = ProductPhoto;