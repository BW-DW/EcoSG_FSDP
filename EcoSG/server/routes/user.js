const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Tutorial } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const authMiddleware = require('../middlewares/auth');
// const { default: Tutorials } = require('../../client/src/pages/Tutorials');
require('dotenv').config();


router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "Only letters, spaces and characters: ' - , . are allowed"),
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

router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            dob: user.dob, // include dob 
            role: user.role // and roles in response
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
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




module.exports = router;

