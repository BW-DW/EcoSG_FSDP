const express = require('express');
const router = express.Router();
const { User, Event, EventParticipant } = require('../models');
const { Op } = require('sequelize');
const yup = require('yup');
const { validateToken } = require('../middlewares/auth');

// Create Event
router.post("/", validateToken, async (req, res) => {
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

// Get All Events
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%{search}%` } },
            { description: { [Op.like]: `%{search}%` } }
        ];
    }

    try {
        let list = await Event.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],
            include: { model: User, as: 'user', attributes: ['name'] }
        });
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Single Event
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let event = await Event.findByPk(id, {
            include: { model: User, as: 'user', attributes: ['name', 'id'] }  // Include user's id as well
        });

        if (!event) {
            return res.sendStatus(404);
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Event
router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    try {
        let event = await Event.findByPk(id);
        if (!event) {
            return res.sendStatus(404);
        }

        let userId = req.user.id;
        if (event.userId != userId) {
            return res.sendStatus(403);
        }

        const data = req.body;
        const validationSchema = yup.object({
            title: yup.string().trim().min(3).max(100),
            description: yup.string().trim().min(3).max(500),
            maxPax: yup.number().integer().min(1).max(200)
        });
        const validatedData = await validationSchema.validate(data, { abortEarly: false });

        let num = await Event.update(validatedData, { where: { id: id } });
        if (num[0] === 1) {
            res.json({ message: "Event was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update event with id ${id}.` });
        }
    } catch (error) {
        res.status(400).json({ errors: error.errors });
    }
});

// Delete Event
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    try {
        let event = await Event.findByPk(id);
        if (!event) {
            return res.sendStatus(404);
        }

        let userId = req.user.id;
        if (event.userId != userId) {
            return res.sendStatus(403);
        }

        let num = await Event.destroy({ where: { id: id } });
        if (num === 1) {
            res.json({ message: "Event was deleted successfully." });
        } else {
            res.status(400).json({ message: `Cannot delete event with id ${id}.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sign Up for Event
router.post("/:id/signup", validateToken, async (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.sendStatus(404);
        }

        // Check if the user is the creator of the event
        if (event.userId === userId) {
            return res.status(400).json({ message: "You cannot sign up for your own event." });
        }

        const existingSignup = await EventParticipant.findOne({
            where: {
                eventId: eventId,
                userId: userId
            }
        });

        if (existingSignup) {
            return res.status(400).json({ message: "User already signed up for this event." });
        }

        await EventParticipant.create({ eventId: eventId, userId: userId });
        res.json({ message: "Successfully signed up for the event." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check Signup Status
router.get("/:id/check-signup", validateToken, async (req, res) => {
    const userId = req.user.id;
    const eventId = req.params.id;

    try {
        const signup = await EventParticipant.findOne({
            where: {
                eventId: eventId,
                userId: userId
            }
        });

        res.json({ signedUp: !!signup });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Signed Up Events
router.get('/signed-up-events', validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const signedUpEvents = await EventParticipant.findAll({
            where: { userId },
            include: [{ model: Event }]
        });
        res.json(signedUpEvents.map(participant => participant.Event));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
