const db = require('../../db/index.js');

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await db.query(
            'SELECT id, username, email, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(result.rows[0]);
    } 
    
    catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};