-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin account
INSERT INTO users (username, email, password, role) 
VALUES (
    'admin', 
    'admin@mintmade.com', 
    '$2b$10$mkGZBcylSs9TtFJyzYc6KOTKFMALEyE2PYMjJNMMRkThCsRUq27b2', -- = admin123
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Shop items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Order items table, relies on other tables
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    item_id INTEGER REFERENCES items(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

--delete after 1 run
ALTER TABLE users 
ADD COLUMN reset_otp VARCHAR(6),
ADD COLUMN reset_otp_expires TIMESTAMP;