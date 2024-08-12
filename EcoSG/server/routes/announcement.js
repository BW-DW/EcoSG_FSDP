const express = require('express');
const router = express.Router();
const { User, Announcement } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');
const nodemailer = require('nodemailer');

async function sendEmails(announcement) {
    let recipients;

    if (announcement.for === 'customer') {
        // Get all customers
        recipients = await User.findAll();
    } else if (announcement.for === 'staff') {
        // Get all staff
        recipients = await User.findAll({ where: { role: 'staff' } });
    }

    // Set up email content
    const emailContent = {
        subject: `${announcement.type !== 'default' ? announcement.type.toUpperCase() + ' ' : ''} New Announcement: ${announcement.subject}`,
        text: `${announcement.description}\n\nCreated at: ${announcement.createdAt}`,
    };

    // Set up email transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'ecosggov@gmail.com', // Your email address
            pass: 'zixuhiqyfpzajjci', // Your email password
        },
    });

    // Send emails to all recipients
    recipients.forEach(user => {
        transporter.sendMail({
            from: 'ecosggov@gmail.com',
            to: user.email,
            subject: emailContent.subject,
            text: emailContent.text,
        }, (error, info) => {
            if (error) {
                console.error(`Error sending email to ${user.email}:`, error);
            } else {
                console.log(`Email sent to ${user.email}:`, info.response);
            }
        });
    });
}

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    
    let validationSchema = yup.object({
        subject: yup.string().trim().min(3).max(100).required(),
        type: yup.string().oneOf(['default', 'important', 'urgent']).required(),
        description: yup.string().trim().min(3).required(),
        for: yup.string().oneOf(['staff', 'customer']).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Announcement.create(data);

        // Send emails after creating the announcement
        await sendEmails(result);

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
            { subject: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    // Add condition for "for" field if provided in query
    let forType = req.query.for;
    if (forType) {
        condition.for = forType;
    }

    let list = await Announcement.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let announcement = await Announcement.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    if (!announcement) {
        res.sendStatus(404);
        return;
    }
    res.json(announcement);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let announcement = await Announcement.findByPk(id);
    if (!announcement) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (announcement.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        subject: yup.string().trim().min(3).max(100),
        type: yup.string().oneOf(['default', 'important', 'urgent']),
        description: yup.string().trim().min(3),
        for: yup.string().oneOf(['staff', 'customer'])
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let num = await Announcement.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            let updatedAnnouncement = await Announcement.findByPk(id); // Fetch updated announcement
            await sendEmails(updatedAnnouncement); // Send emails
            res.json({
                message: "Announcement was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update announcement with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let announcement = await Announcement.findByPk(id);
    if (!announcement) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (announcement.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Announcement.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Announcement was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete announcement with id ${id}.`
        });
    }
});

module.exports = router;