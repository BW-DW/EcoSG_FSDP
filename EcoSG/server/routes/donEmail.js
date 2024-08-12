const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const router = express.Router();

var transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    user: 'EcoSGGov@gmail.com',
    pass: 'zixu hiqy fpza jjci',
  },
});

const sendEmail = async (email) =>{
  var mailOptions = {
    from: 'EcoSGGov@gmail.com',
    to: email,
    subject: 'Thanks',
    text: `Thank you for your donation`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
} catch (error) {
    console.error('Error sending email:', error);
}};

router.post("/send_receipt", async (req, res) => {

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //     res.status(500).json({ success: false, error: 'Failed to send email' });
    //   } else {
    //     console.log('Email sent: ' + info.response);
    //     res.json({ success: true });
    //   }
    // });
    const email = req.body.email; // assuming you're sending the email in the request body
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

    try {
      await sendEmail(email);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }});

module.exports = router;