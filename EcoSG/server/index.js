const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Routes
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);

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
    