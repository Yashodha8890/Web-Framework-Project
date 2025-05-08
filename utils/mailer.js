// utils/mailer.js
const nodemailer = require('nodemailer');

// Create a transporter for Gmail (you can change this to your email provider's SMTP settings)
const transporter = nodemailer.createTransport({
  service: 'gmail',        // Gmail SMTP service (change it if you are using a different email service)
  auth: {
    user: 'yasho.aapy@gmail.com',  // Your Gmail address
    pass: 'xhhp xath taie msms',     // Your Gmail app password (if using 2FA, create an app password)
  },
  tls: {
    rejectUnauthorized: false,     // This allows bypassing SSL certificate validation errors
  },
});

// Function to send an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'dailyroutingtracker@gmail.com',// Sender's email address        
    to,                              // Recipient email address
    subject,                         // Email subject
    html: text,                      // HTML content of the email (formatted message)
  };

  // Send the email using Nodemailer
  return transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent: ' + info.response);  // Log success
    })
    .catch(err => {
      console.log('Error sending email: ', err);  // Log any errors
    });
};

module.exports = sendEmail;  // Export the sendEmail function for use in other parts of your app

