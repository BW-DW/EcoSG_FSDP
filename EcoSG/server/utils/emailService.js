// const nodemailer = require('nodemailer');

// // Create a transporter object using SMTP transport
// const transporter = nodemailer.createTransport({
//     service: 'Gmail', // Use your email provider here
//     auth: {
//         user: 'your-email@example.com',
//         pass: 'your-email-password'
//     }
// });

// // Function to send email
// async function sendRewardEmail(userEmail, eventTitle) {
//     const mailOptions = {
//         from: 'your-email@example.com',
//         to: userEmail,
//         subject: 'Congratulations on Completing an Event!',
//         text: `Congratulations on completing ${eventTitle}!`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         return { success: true };
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Failed to send email');
//     }
// }

// module.exports = sendRewardEmail;
