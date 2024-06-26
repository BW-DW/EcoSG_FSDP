const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Tutorial } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
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
        // Create user
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
            name: user.name
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
        name: req.user.name
    };
    res.json({
        user: userInfo
    });
});


router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;

    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        let users = await User.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],
            include: { 
                model: Tutorial, 
                as: "Tutorials", 
                attributes: ['title', 'description'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching users.", error: err.message });
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

    // Check if the request user id matches the user id to be deleted
    let userId = req.user.id;
    if (user.id != userId) {
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

    // Check if the request user id matches the user id to be updated
    let userId = req.user.id;
    if (user.id != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    let validationSchema;

    if (data.password) {
        validationSchema = yup.object({
            password: yup.string().trim().min(8).required()
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must have at least 1 letter and 1 number")
        });
        data.password = await bcrypt.hash(data.password, 10);
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
        data = await validationSchema.validate(data, { abortEarly: false });

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



module.exports = router;

