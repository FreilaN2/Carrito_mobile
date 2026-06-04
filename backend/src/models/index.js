const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// --- Asociaciones (Relaciones) ---

// 1. Categoría <-> Producto (Uno a Muchos)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products', onDelete: 'SET NULL' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// 2. Usuario <-> Pedido (Uno a Muchos)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 3. Pedido <-> Ítems de Pedido (Uno a Muchos)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// 4. Producto <-> Ítems de Pedido (Uno a Muchos)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'order_items', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderItem
};
