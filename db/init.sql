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


-- Delete after 1 run
INSERT INTO items (name, category, price, image_url) VALUES 
    ('White Shirt (F)', 'women', 49.90, 'https://plus.unsplash.com/premium_photo-1693242804347-38b4382b3c4d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Chinos (M)', 'men', 59.00, 'https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    ('Linen Dress (F)', 'women', 79.00, 'https://images.unsplash.com/photo-1764298493197-a1c1cce57800?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxpbmVuJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'),
    ('Black Shirt (F)', 'women', 55.00, 'https://plus.unsplash.com/premium_photo-1691622500278-868ca3554736?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGJsYWNrJTIwc2hpcnR8ZW58MHx8MHx8fDA%3D'),
    ('Watch', 'accessories', 120.00, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=788&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');