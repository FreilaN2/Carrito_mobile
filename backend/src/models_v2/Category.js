const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.CHAR(1) }
}, { tableName: 'categories', timestamps: false });

module.exports = Category;