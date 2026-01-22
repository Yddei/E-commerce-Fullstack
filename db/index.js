const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const initDb = async () => {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    let connected = false;
    let attempts = 0;

    while (!connected && attempts < 10) {
        try {
            attempts++;
            // Test the connection
            await pool.query('SELECT 1'); 
            // Run the migration
            await pool.query(sql);
            
            console.log("Database connected and tables initialized");
            connected = true;
        } catch (err) {
            console.log(`DB connection failed (Attempt ${attempts}/10). Retrying in 5s...`);
            // Wait for 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

    if (!connected) {
        console.error("Could not connect to the database after 10 attempts. Exiting.");
        process.exit(1);
    }
};

initDb();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};