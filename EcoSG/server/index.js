const express = require('express');
const axios = require('axios'); 
const cors = require('cors');
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
    
