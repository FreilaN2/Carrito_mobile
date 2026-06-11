const sequelize = require('../config/database');

const Category = require('./Category');
const Price = require('./Price');
const Product = require('./Product');
const Inventory = require('./Inventory');
const ProductPhoto = require('./ProductPhoto');
const Sale = require('./Sale');
const ProductSale = require('./ProductSale');
const Customer = require('./Customer');
const Coupon = require('./Coupon');
const ShoppingCar = require('./ShoppingCar');
const ShoppingCarProduct = require('./ShoppingCarProduct');
const DeliveryAddress = require('./DeliveryAddress');
const Order = require('./Order');
const Billing = require('./Billing');
const PaymentMethod = require('./PaymentMethod');
const PaymentMethodOrder = require('./PaymentMethodOrder');
const ParameterValue = require('./ParameterValue');

// --- Asociaciones (Relaciones) ---

// Price & Product (1:M)
Price.hasMany(Product, { foreignKey: 'price_id', as: 'products' });
Product.belongsTo(Price, { foreignKey: 'price_id', as: 'price' });

// Category & Product (1:M)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product & Inventory (1:M)
Product.hasMany(Inventory, { foreignKey: 'product_id', as: 'inventory' });
Inventory.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product & ProductPhoto (1:M)
Product.hasMany(ProductPhoto, { foreignKey: 'product_id', as: 'photos' });
ProductPhoto.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Product & Sale (M:M through ProductSale)
Product.belongsToMany(Sale, { through: ProductSale, foreignKey: 'product_id', as: 'sales' });
Sale.belongsToMany(Product, { through: ProductSale, foreignKey: 'sale_id', as: 'products' });

// Customer & Coupon (1:M)
Customer.hasMany(Coupon, { foreignKey: 'customer_id', as: 'coupons' });
Coupon.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Coupon & ShoppingCar (1:M)
Coupon.hasMany(ShoppingCar, { foreignKey: 'coupon_id', as: 'shopping_cars' });
ShoppingCar.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

// ShoppingCar & Product (M:M through ShoppingCarProduct)
ShoppingCar.belongsToMany(Product, { through: ShoppingCarProduct, foreignKey: 'shopping_car_id', as: 'products' });
Product.belongsToMany(ShoppingCar, { through: ShoppingCarProduct, foreignKey: 'product_id', as: 'shopping_cars' });

// Customer & Order (1:M)
Customer.hasMany(Order, { foreignKey: 'customer_id', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// DeliveryAddress & Order (1:M)
DeliveryAddress.hasMany(Order, { foreignKey: 'delivery_address_id', as: 'orders' });
Order.belongsTo(DeliveryAddress, { foreignKey: 'delivery_address_id', as: 'delivery_address' });

// ShoppingCar & Order (1:1)
ShoppingCar.hasOne(Order, { foreignKey: 'shopping_car_id', as: 'order' });
Order.belongsTo(ShoppingCar, { foreignKey: 'shopping_car_id', as: 'shopping_car' });

// Order & Billing (1:1)
Order.hasOne(Billing, { foreignKey: 'order_id', as: 'billing' });
Billing.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Order & PaymentMethod (M:M through PaymentMethodOrder)
Order.belongsToMany(PaymentMethod, { through: PaymentMethodOrder, foreignKey: 'order_id', as: 'payment_methods' });
PaymentMethod.belongsToMany(Order, { through: PaymentMethodOrder, foreignKey: 'payment_method_id', as: 'orders' });

module.exports = {
  sequelize,
  Category,
  Price,
  Product,
  Inventory,
  ProductPhoto,
  Sale,
  ProductSale,
  Customer,
  Coupon,
  ShoppingCar,
  ShoppingCarProduct,
  DeliveryAddress,
  Order,
  Billing,
  PaymentMethod,
  PaymentMethodOrder,
  ParameterValue
};
