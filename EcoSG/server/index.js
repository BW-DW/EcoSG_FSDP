const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { User } = require('./models');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to EcoSG");
});

const getUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

// In a real app, you should use environment variables for sensitive information
const transporter = nodemailer.createTransport({
    // service: 'Yahoo', // You can use any service, such as Gmail, Yahoo, etc.
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'bwgyanimate@gmail.com', // Your email address
        pass: 'frqkodlqfpmpkmpd', // Your email password
    },
});

// Generate a random verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// data-sitekey="6LfbKSQqAAAAAFXdxb9hN5dQYW_XkmmflREUQc_p"
// reCAPTCHA Verification Middleware
const verifyRecaptcha = async (token) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await axios.post(url);
    return response.data.success;
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: Array.isArray(err.message) ? err.message : [err.message],
    });
});

// Routes
const rewardRoute = require('./routes/reward');
app.use("/reward", rewardRoute);
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const announcementRoute = require('./routes/announcement');
app.use("/announcement", announcementRoute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
const facilityRoute = require('./routes/facilities');
app.use("/facilities", facilityRoute);
const contactRoute = require('./routes/contact');
app.use(contactRoute);

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

app.post('/event', async (req, res) => {
    const {
        title,
        description,
        organisers,
        status,
        date,
        time,
        location,
        maxPax,
        facilities,
        manpower,
        userId
    } = req.body;

    try {
        const event = await Event.create({
            title,
            description,
            organisers,
            status,
            date,
            time,
            location,
            maxPax,
            facilities,
            manpower,
            userId
        });
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Routes
app.post("/user/login", async (req, res) => {
    const { email, password, recaptchaToken, incorrectAttempts } = req.body;

    if (incorrectAttempts > 0) {
        const recaptchaVerified = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaVerified) {
            return res.status(400).json({ message: "reCAPTCHA verification failed" });
        }
    }

    // Proceed with your login logic here...
    res.json({ accessToken: "dummy_token", user: { name: "User", role: "customer" } });
});

app.post("/user/register", async (req, res) => {
    const { name, email, password, confirmPassword, dob, recaptchaToken } = req.body;

    const recaptchaVerified = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaVerified) {
        return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    // Proceed with your registration logic here...
    res.json({ message: "Registration successful!" });
});

// Endpoint to send the verification code
app.post('/send-verification-code', async (req, res) => {
    const { userId } = req.body;
    const user = await getUserById(userId); // Replace with your method to get the user

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const verificationCode = generateVerificationCode();

    // Store the code in the user's record (you'll need to implement this)
    user.verificationCode = verificationCode;
    await user.save();

    const mailOptions = {
        from: 'bwgyanimate@gmail.com',
        to: user.email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${verificationCode}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send verification code' });
    }
});

// Your existing logic for verification
app.post('/verify-email', async (req, res) => {
    const { userId, code } = req.body;
    const user = await getUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.verificationCode === code) {
        user.verified = true;
        user.verificationCode = null; // Clear the code after successful verification
        await user.save();
        res.json({ success: true, message: 'Email verified successfully' });
    } else {
        res.json({ success: false, message: 'Invalid verification code' });
    }
});

app.post('/user/reset-password', async (req, res) => {
    const { token, email, newPassword } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email,
                resetToken: token,
                resetTokenExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password and save it to the database
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null; // Clear the reset token
        user.resetTokenExpires = null; // Clear the token expiration
        await user.save();

        res.json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});