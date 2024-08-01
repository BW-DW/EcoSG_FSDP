const express = require('express');
const router = express.Router();
const { Contact } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// Contact Us API
router.post("/contactmessages", async (req, res) => {
  console.log("Received request body:", req.body);
  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    name: yup.string().trim().min(3).max(100).required(),
    email: yup.string().trim().email().required(),
    message: yup.string().trim().max(500).required()
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    console.log("Validation successful:", data);
    let contactMessage = await Contact.create(data);
    console.log("Contact message created:", contactMessage);
    res.json(contactMessage);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(400).json({ errors: err.errors });
  }
});

// Get all contact messages API
router.get("/contactmessages", async (req, res) => {
  let condition = {};
  let contactMessages = await Contact.findAll({
    where: condition,
    order: [['createdAt', 'DESC']]
  });
  res.json(contactMessages);
});

// Get a single contact message API
router.get("/contactmessages/:id", async (req, res) => {
  let id = req.params.id;
  let contactMessage = await Contact.findByPk(id);
  if (!contactMessage) {
    res.sendStatus(404);
    return;
  }
  res.json(contactMessage);
});

// Delete a contact message API
router.delete("/contactmessages/:id", async (req, res) => {
  let id = req.params.id;
  let contactMessage = await Contact.findByPk(id);
  if (!contactMessage) {
    res.sendStatus(404);
    return;
  }
  await contactMessage.destroy();
  res.json({ message: "Contact message deleted successfully." });
});

module.exports = router;