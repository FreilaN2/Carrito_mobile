const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  email: { type: DataTypes.TEXT, allowNull: false, unique: true },
  password_hash: { type: DataTypes.BLOB, allowNull: false },
  status: { type: DataTypes.CHAR(1) },
  level: { type: DataTypes.TEXT }
}, { 
  tableName: 'customers', 
  timestamps: false,
  hooks: {
    beforeCreate: async (customer) => {
      if (customer.password_hash) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(customer.password_hash.toString(), salt);
        customer.password_hash = Buffer.from(hash);
      }
    }
  }
});

Customer.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash.toString());
};

module.exports = Customer;