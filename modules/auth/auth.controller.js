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
                username: user.username,
                role: user.role
            },
            secret,
            {expiresIn: '1h'}
        );
        res.status(200).json({
            message: "Login Success",
            token: token,
            user: {
                username: user.username, 
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

//Reset password
//otp request
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rowCount === 0) {
            return res.status(404).json({ message: "No account found with that email." });
        }

        //6 digit otp, expire 1 min
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 1 * 60 * 1000); 

        // Save to DB
        await db.query(
            'UPDATE users SET reset_otp = $1, reset_otp_expires = $2 WHERE email = $3',
            [otp, expires, email]
        );

//fake email server, no email is really sent
        console.log(`\nPassword Reset Requested!`);
        console.log(`===prototype of email server===`)
        console.log(` Send to: ${email}`);
        console.log(` OTP CODE: ${otp}\n`);
        res.status(200).json({ message: "OTP sent to your email." });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
};

//reset
exports.verifyAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    //otp check
    try {
        const result = await db.query(
            'SELECT reset_otp, reset_otp_expires FROM users WHERE email = $1', 
            [email]
        );
        const user = result.rows[0];
        if (!user || user.reset_otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }
        if (new Date() > new Date(user.reset_otp_expires)) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        //otp check pass
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(
            'UPDATE users SET password = $1, reset_otp = NULL, reset_otp_expires = NULL WHERE email = $2', 
            [hashedPassword, email]
        );

        res.status(200).json({ message: "Password reset successfully. You can now log in." });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
};