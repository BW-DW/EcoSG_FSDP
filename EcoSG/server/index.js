const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { User } = require('./models');
const oldUserData = {};
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
            console.log(`⚡ Server is running on http://localhost:${port}`);
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

// Send OTP
app.post('/send-verification-code-pass', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateVerificationCode();
    user.verificationCode = otp;
    await user.save();

    const mailOptions = {
        from: 'bwgyanimate@gmail.com',
        to: user.email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// Verify OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email, verificationCode: otp } });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    res.json({ success: true, message: 'OTP verified successfully' });
});

app.post('/save-old-data', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Store the old data
        oldUserData[userId] = {
            oldName: user.name,
            oldEmail: user.email,
            oldDob: user.dob
        };

        res.json({ success: true, message: 'Old data saved successfully' });
    } catch (error) {
        console.error('Error saving old data:', error);
        res.status(500).json({ success: false, message: 'Failed to save old data' });
    }
});

// Notify user of username change
app.post('/notify-username-change', async (req, res) => {
    const { userId, newUsername } = req.body;
    const user = await getUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!oldUserData[userId]) {
        return res.status(404).json({ success: false, message: 'Old data not available' });
    }

    if (user.verified) {
        const oldName = oldUserData[userId].oldName;

        const mailOptions = {
            from: 'bwgyanimate@gmail.com',
            to: user.email,
            subject: 'Username Change Notification',
            text: `Dear ${oldName},\n\nYour username has been changed to: ${newUsername}.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nEcoSG`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send notification' });
        }
    }
});

// Notify user of password change
app.post('/notify-password-change', async (req, res) => {
    const { userId } = req.body;
    const user = await getUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.verified) {

        const mailOptions = {
            from: 'bwgyanimate@gmail.com',
            to: user.email,
            subject: 'Password Change Notification',
            text: `Dear ${user.name},\n\nYour password has been changed successfully.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nEcoSG`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send notification' });
        }
    }
});

// Notify user of date of birth change
app.post('/notify-dob-change', async (req, res) => {
    const { userId, newDob } = req.body;
    const user = await getUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.verified) {

        const mailOptions = {
            from: 'bwgyanimate@gmail.com',
            to: user.email,
            subject: 'Date of Birth Change Notification',
            text: `Dear ${user.name},\n\nYour date of birth has been updated to: ${newDob}.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nEcoSG`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send notification' });
        }

    }
});

// Notify user of email change
app.post('/notify-email-change', async (req, res) => {
    const { userId, newEmail } = req.body;
    const user = await getUserById(userId);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!oldUserData[userId]) {
        return res.status(404).json({ success: false, message: 'Old data not available' });
    }

    if (user.verified) {

        const oldEmail = oldUserData[userId].oldEmail;

        const mailOptions = {
            from: 'bwgyanimate@gmail.com',
            to: oldEmail,
            subject: 'Email Change Notification',
            text: `Dear ${user.name},\n\nYour email address has been changed to: ${newEmail}.\nYou must verify your new email.\n\nIf you did not request this change, please contact support immediately.\n\nBest regards,\nEcoSG`
        };

        try {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send notification' });
        }
    }
});

app.post("/user/notify-login", async (req, res) => {
    const { userId } = req.body;

    try {
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.verified) {
            const mailOptions = {
                from: 'bwgyanimate@gmail.com',
                to: user.email,
                subject: 'New Login Detected',
                text: `Dear ${user.name},\n\nA new login to your account was detected on ${new Date().toLocaleString()}.\n\nIf this was not you, please contact support immediately.\n\nBest regards,\nEcoSG`
            };

            try {
                await transporter.sendMail(mailOptions);
                res.json({ success: true, message: 'Login notification email sent successfully' });
            } catch (error) {
                console.error('Error sending login notification email:', error);
                res.status(500).json({ success: false, message: 'Failed to send login notification email' });
            }
        } else {
            res.json({ success: false, message: 'User is not verified' });
        }

    } catch (error) {
        console.error('Error notifying login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});