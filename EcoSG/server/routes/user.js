const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User, Reward } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const authMiddleware = require('../middlewares/auth');
// const { default: Rewards } = require('../../client/src/pages/Rewards');
require('dotenv').config();

router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password must have at least 1 letter and 1 number"),
        dob: yup.date().nullable().required('Date of Birth is required').max(new Date(), 'Date of Birth cannot be in the future')
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }

        // Hash passowrd
        data.password = await bcrypt.hash(data.password, 10);
        // Create user with default role 'customer'
        data.role = 'customer';
        let result = await User.create(data);
        res.json({
            message: `Email ${result.email} was registered successfully.`
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'bwgyanimate@gmail.com',
        pass: 'frqkodlqfpmpkmpd'
    }
});

// Temporary data store (could be a database or in-memory store)
const tempDataStore = new Map();

router.post("/login", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            return res.status(400).json({ message: errorMsg });
        }
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            return res.status(400).json({ message: errorMsg });
        }

        // Generate a 2FA code
        const twoFACode = crypto.randomInt(100000, 999999).toString();

        // Store user info and 2FA code temporarily
        tempDataStore.set(user.email, { userInfo: user, twoFACode });

        // Send the 2FA code via email
        const mailOptions = {
            from: 'bwgyanimate@gmail.com',
            to: user.email,
            subject: 'Your 2FA Code',
            text: `Your 2FA verification code is: ${twoFACode}`,
            html: `<p>Your 2FA verification code is: <strong>${twoFACode}</strong></p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending 2FA email:', error);
                return res.status(500).json({ message: 'Error sending 2FA code. Please try again.' });
            }
            console.log('2FA email sent:', info.response);
        });

        // Respond with a message indicating that 2FA is required
        return res.status(200).json({
            message: "A 2FA code has been sent to your email. Please verify to proceed.",
            twoFANeeded: true,
            email: user.email
        });

    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
});

// 2FA verification route
router.post("/verify-2fa", async (req, res) => {
    const { email, twoFACode } = req.body;

    const tempData = tempDataStore.get(email);
    if (!tempData || tempData.twoFACode !== twoFACode) {
        return res.status(400).json({ message: "Invalid 2FA code." });
    }

    const userInfo = {
        id: tempData.userInfo.id,
        email: tempData.userInfo.email,
        name: tempData.userInfo.name,
        dob: tempData.userInfo.dob,
        role: tempData.userInfo.role
    };
    let accessToken = sign(userInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });

    // Remove temporary data after successful login
    tempDataStore.delete(email);

    return res.json({
        accessToken: accessToken,
        user: userInfo
    });
});

router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        dob: req.user.dob, // include dob
        role: req.user.role // and role in response
    };
    res.json({
        user: userInfo
    });
});


router.get('/', async (req, res) => {
    const { search, filter, order } = req.query;
    const filterCondition = filter ? { role: filter } : {};

    // Determine the order condition based on user input
    const orderCondition = order === 'ascending' ? ['id', 'ASC'] : ['id', 'DESC'];

    const whereCondition = search
        ? {
              ...filterCondition,
              [Op.or]: [
                  { name: { [Op.like]: `%${search}%` } },
                  { email: { [Op.like]: `%${search}%` } },
                  { role: { [Op.like]: `%${search}%` } },
              ],
          }
        : filterCondition;

    try {
        const users = await User.findAll({
            where: whereCondition,
            order: [orderCondition],
        });
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;

    try {
        let user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: `User with id ${id} not found.` });
            return;
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving user.", error: err.message });
    }
});


router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    // Check if the user exists
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    // Check if the request user id matches the user id or staff to be deleted
    if (req.user.role !== 'staff' && req.user.id !== user.id) {
        res.sendStatus(403);
        return;
    }

    // Delete user
    let num = await User.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "User was deleted successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot delete user with id ${id}.`
        });
    }
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    // Check if the user exists
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    // Check if the request user id matches the user id to be updated or is same as staff user
    if (req.user.role !== 'staff' && req.user.id !== user.id) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    let validationSchema;

    if (data.password) {
        validationSchema = yup.object({
            password: yup.string().trim().min(8).required()
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must have at least 1 letter and 1 number"),
            currentPassword: yup.string().trim().required('Current Password is required')
        });

        try {
            data = await validationSchema.validate(data, { abortEarly: false });

            // Validate current password
            const match = await bcrypt.compare(data.currentPassword, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash the new password
            data.password = await bcrypt.hash(data.password, 10);
        } catch (err) {
            return res.status(400).json({ errors: err.errors });
        }
    } else if (data.email) {
        validationSchema = yup.object({
            email: yup.string().trim().lowercase().email().max(50).required()
        });
    } else {
        validationSchema = yup.object({
            name: yup.string().trim().min(3).max(50).required()
                .matches(/^[a-zA-Z '-,.]+$/, "Only letters, spaces and characters: ' - , . are allowed")
        });
    }

    try {
        if (!data.password) {
            data = await validationSchema.validate(data, { abortEarly: false });
        }

        let num = await User.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: `${Object.keys(data)[0]} was updated successfully.`
            });
        } else {
            res.status(400).json({
                message: `Cannot update user with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Route to change role to staff
router.put('/:id/role/staff', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.role = 'staff';
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Route to change role to customer
router.put('/:id/role/customer', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.role = 'customer';
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Reset Password Route
router.put('/:email/reset-password', async (req, res) => {
    const { email } = req.params;
    const { otp, password } = req.body;

    // Find the user based on email and OTP
    const user = await User.findOne({ where: { email, verificationCode: otp } });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Validate the new password
    const validationSchema = yup.object({
        password: yup.string().trim().min(8).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must have at least 1 letter and 1 number")
    });

    try {
        const data = await validationSchema.validate({ password }, { abortEarly: false });

        // Hash the new password and save it to the database
        user.password = await bcrypt.hash(data.password, 10);
        user.verificationCode = ""; // Clear the OTP
        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
});


module.exports = router;
