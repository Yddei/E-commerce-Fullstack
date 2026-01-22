//CONFIG
const db = require('../../db/index.js');

//OTHER LIBRARIES
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const authenticateToken = require('../../middleware/auth.js')

//FUNCTIONS
//Creation/Changing of Password, salting and hashing
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

//API ROUTES
//Register
exports.register = async (req,res)=>{
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        
        //Query to database
        await db.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user: " + err.message });
    }

};

//Log in
exports.login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const result = await db.query ('SELECT * FROM users WHERE email = $1', [email])
        
        //Check for existing email
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        //Check password
        const user = result.rows[0]
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        //Success, JWT Assignment
        const token = jwt.sign(
            {
                userId: user.id, 
                username: user.username
            },
            secret,
            {expiresIn: '1h'}
        );
        res.status(200).json({
            message: "Login Success",
            token: token
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};