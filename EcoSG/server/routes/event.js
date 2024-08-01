const express = require('express');
const router = express.Router();
const { User, Event, EventParticipant } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Event.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Event.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });

    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (event.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500),
        maxPax: yup.number().integer().min(1).max(200)
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        let num = await Event.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({ message: "Event was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update event with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (event.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Event.destroy({ where: { id: id } });
    if (num == 1) {
        res.json({ message: "Event was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete event with id ${id}.` });
    }
});

// Sign up for an event
router.post("/:id/signup", validateToken, async (req, res) => {
    let eventId = req.params.id;
    let userId = req.user.id;

    try {
        let existingSignUp = await EventParticipant.findOne({
            where: { eventId: eventId, userId: userId }
        });

        if (existingSignUp) {
            return res.status(400).json({ message: 'User already signed up for this event' });
        }

        let signUp = await EventParticipant.create({ eventId: eventId, userId: userId });
        res.json(signUp);
    } catch (err) {
        console.error('Error signing up:', err);
        res.status(500).json({ message: 'Failed to sign up for the event' });
    }
});

// Check if user has signed up for the event
router.get('/:id/check-signup', validateToken, async (req, res) => {
    let eventId = req.params.id;
    let userId = req.user.id;

    try {
        let existingSignUp = await EventParticipant.findOne({
            where: { eventId: eventId, userId: userId }
        });

        res.json({ signedUp: !!existingSignUp });
    } catch (err) {
        console.error('Error checking sign up:', err);
        res.status(500).json({ message: 'Failed to check sign up' });
    }
});

// Fetch signed-up events for the logged-in user
router.get("/signed-up", validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const signedUpEvents = await Event.findAll({
            include: {
                model: User,
                as: 'participants',
                where: {
                    id: userId,
                },
                attributes: [],
            },
            order: [['date', 'DESC']],
        });
        res.json(signedUpEvents);
    } catch (err) {
        console.error('Failed to fetch signed up events', err);
        res.status(500).json({ message: 'Failed to fetch signed up events' });
    }
});






module.exports = router;
