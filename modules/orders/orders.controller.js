const db = require('../../db/index.js');

//make order
exports.createOrder = async (req, res) => {
    //authN, order made by real person
    const userId = req.user.userId;
    const { cartItems } = req.body; 
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    try {
        await db.query('BEGIN');
        //zero trust: get total price by item id on server side, prevent tampering from front end
        const itemIds = cartItems.map(item => item.id);
        const dbItemsResult = await db.query(
            'SELECT id, price FROM items WHERE id = ANY($1::int[])',
            [itemIds]
        );
        const dbItems = dbItemsResult.rows;
        let calculatedTotal = 0;
        const validOrderItems = [];
        for (const cartItem of cartItems) {
            const dbItem = dbItems.find(i => i.id === cartItem.id);
            //zero trust: dont allow if user tamper with unknown id
            if (!dbItem) {
                throw new Error(`Item ID ${cartItem.id} not found`);
            }
            const itemTotal = Number(dbItem.price) * cartItem.quantity;
            calculatedTotal += itemTotal;

            validOrderItems.push({
                id: dbItem.id,
                quantity: cartItem.quantity,
                realPrice: dbItem.price // <--- The secure price
            });
        }
        const orderResult = await db.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
            [userId, calculatedTotal, 'paid']
        );
        const orderId = orderResult.rows[0].id;
        
        for (const item of validOrderItems) {
            await db.query(
                'INSERT INTO order_items (order_id, item_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
                [orderId, item.id, item.quantity, item.realPrice]
            );
        }
        await db.query('COMMIT');
        res.status(201).json({ message: "Order placed successfully", orderId: orderId });
    } 
    catch (err) {
        await db.query('ROLLBACK');
        console.error("Order Error:", err.message);
        res.status(500).json({ message: "Error placing order" });
    }
};

//view orders for admin
exports.getAllOrders = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT orders.id, users.username, orders.total_amount, orders.status, orders.created_at 
            FROM orders 
            JOIN users ON orders.user_id = users.id 
            ORDER BY orders.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching orders" });
    }
};