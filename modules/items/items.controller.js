const db = require('../../db/index.js');

//get all when enter catalogue page
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

//admin create item
exports.createItem = async (req, res) => {
    const { name, category, price, image_url } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO items (name, category, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, category, price, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding item" });
    }
};

//admin delete item
exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM items WHERE id = $1", [id]);
        res.status(200).json({ message: "Item deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting item" });
    }
};