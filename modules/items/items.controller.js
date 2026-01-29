const db = require('../../db/index.js');

exports.getAllItems = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM items ORDER BY id ASC');
        res.status(200).json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching items" });
    }
};