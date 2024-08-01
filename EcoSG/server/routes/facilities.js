const express = require('express');
const router = express.Router();
const { User, Facility } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        location: yup.string().required(),
        facilityType: yup.string().required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Facility.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let {search,location,facilityType} = req.query;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    if (location) {
        const locationArray = location.split(",").map(loc => loc.trim()).filter(loc => loc);
        if (locationArray.length > 0) {
            condition.location = { [Op.in]: locationArray };
        }
    }

    if (facilityType) {
        const facilityTypeArray = facilityTypes.split(",").map(type => type.trim()).filter(type => type);
        if (facilityTypeArray.length > 0) {
            condition.facilityType = { [Op.in]: facilityTypeArray };
        }
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await Facility.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let facility = await Facility.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    // Check id not found
    if (!facility) {
        res.sendStatus(404);
        return;
    }
    res.json(facility);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let facility = await Facility.findByPk(id);
    if (!facility) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (facility.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500),
        location: yup.string().required(),
        facilityType: yup.string().required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Facility.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Facility was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update facility with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let facility = await Facility.findByPk(id);
    if (!facility) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (facility.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Facility.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Facility was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete facility with id ${id}.`
        });
    }
});

module.exports = router;