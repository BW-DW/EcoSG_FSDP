const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
        user: 'eco0.sg@gmail.com',
        pass: 'xwmh mrhl sbss nbhi',
    },
});

// Function to send the contact us email
const sendContactUsEmail = async (toEmail, userName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Thank you for contacting us!',
        text: `Dear ${userName},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nBest regards,\nEco SG`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendContactUsEmail,
};
