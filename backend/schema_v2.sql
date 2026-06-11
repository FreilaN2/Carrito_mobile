-- Base de datos sugerida: carrito_v2

-- 1. CATEGORIES
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    status CHAR(1)
);

-- 2. PRICES
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    base_amount REAL NOT NULL,
    iva DECIMAL DEFAULT 0.16,
    igtf DECIMAL,
    total_amount REAL,
    discount DECIMAL
);

-- 3. PRODUCTS
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    price_id INTEGER REFERENCES prices(id),
    category_id INTEGER REFERENCES categories(id),
    name TEXT NOT NULL,
    status CHAR(1),
    manufacturing_date TIMESTAMP,
    expiration_date TIMESTAMP,
    height REAL,
    manufacturing_place TEXT,
    weight REAL,
    description TEXT,
    presentation TEXT
);

-- 4. INVENTORY
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    stock INTEGER NOT NULL DEFAULT 0,
    max_stock INTEGER,
    min_stock INTEGER
);

-- 5. PRODUCTS_PHOTOS
CREATE TABLE products_photos (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    format TEXT,
    description TEXT,
    photo BYTEA
);

-- 6. SALES
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    description TEXT,
    percent DECIMAL,
    status CHAR(1)
);

-- 7. PRODUCTS_SALES
CREATE TABLE products_sales (
    product_id INTEGER REFERENCES products(id),
    sale_id INTEGER REFERENCES sales(id),
    created_date TIMESTAMP,
    expiration_date TIMESTAMP,
    PRIMARY KEY (product_id, sale_id)
);

-- 8. CUSTOMERS
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash BYTEA NOT NULL,
    status CHAR(1),
    level TEXT
);

-- 9. COUPONS
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    type TEXT,
    amount_discount REAL,
    percent_discount DECIMAL
);

-- 10. SHOPPING_CAR
CREATE TABLE shopping_car (
    id SERIAL PRIMARY KEY,
    coupon_id INTEGER REFERENCES coupons(id),
    created_date TIMESTAMP,
    status CHAR(1),
    estimated_total DOUBLE PRECISION
);

-- 11. SHOPPING_CAR_PRODUCTS
CREATE TABLE shopping_car_products (
    shopping_car_id INTEGER REFERENCES shopping_car(id),
    product_id INTEGER REFERENCES products(id),
    amount REAL,
    total_amount REAL,
    PRIMARY KEY (shopping_car_id, product_id)
);

-- 12. DELIVERY_ADDRESS
CREATE TABLE delivery_address (
    id SERIAL PRIMARY KEY,
    address TEXT,
    city TEXT,
    parish TEXT,
    municipality TEXT,
    state TEXT,
    country TEXT,
    zip_code INTEGER,
    telephone_number TEXT
);

-- 13. ORDERS
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    shopping_car_id INTEGER UNIQUE REFERENCES shopping_car(id),
    delivery_address_id INTEGER REFERENCES delivery_address(id),
    customer_id INTEGER REFERENCES customers(id),
    total_base REAL,
    iva DECIMAL,
    total_amount REAL,
    delivery BOOLEAN,
    amount_delivery DECIMAL
);

-- 14. BILLING
CREATE TABLE billing (
    id SERIAL PRIMARY KEY,
    order_id INTEGER UNIQUE REFERENCES orders(id),
    name TEXT,
    lastname TEXT,
    address TEXT,
    city TEXT,
    parish TEXT,
    municipality TEXT,
    state TEXT,
    country TEXT,
    zip_code INTEGER,
    telephone_number TEXT,
    email TEXT
);

-- 15. PAYMENT_METHODS
CREATE TABLE payment_methods (
    id SERIAL PRIMARY KEY,
    description TEXT,
    method TEXT,
    bank_account TEXT,
    cedula TEXT,
    account_holder TEXT,
    cellphone_number TEXT,
    email TEXT,
    currency TEXT
);

-- 16. PAYMENT_METHODS_ORDERS
CREATE TABLE payment_methods_orders (
    order_id INTEGER REFERENCES orders(id),
    payment_method_id INTEGER REFERENCES payment_methods(id),
    date TIMESTAMP,
    PRIMARY KEY (order_id, payment_method_id)
);

-- 17. PARAMETERS_VALUES
CREATE TABLE parameters_values (
    id SERIAL,
    key TEXT,
    value TEXT,
    description TEXT,
    status BOOLEAN,
    PRIMARY KEY (id, key)
);
