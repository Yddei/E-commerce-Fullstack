const db = require('../../db/index.js');

exports.getDashboardStats = async (req, res) => {
    try {
        const userCount = await db.query('SELECT COUNT(*) FROM users');
        const orderCount = await db.query('SELECT COUNT(*) FROM orders');
        const revenue = await db.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders');

        res.json({
            users: parseInt(userCount.rows[0].count),
            orders: parseInt(orderCount.rows[0].count),
            revenue: parseFloat(revenue.rows[0].total)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};