const { sendContactUsEmail } = require('../models/emailService');

const saveContactMessage = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save the contact message to the database (replace this with your actual database save logic)
        // Example: await ContactMessage.create({ name, email, message });
        console.log('Contact message received:', { name, email, message });

        // Send an email notification to the user
        await sendContactUsEmail(email, name);

        // Send success response
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error handling contact message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
module.exports={saveContactMessage};