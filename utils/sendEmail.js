// utils/sendEmail.js
const nodemailer = require('nodemailer');

// Create a transporter for Gmail 
const transporter = nodemailer.createTransport({
  service: 'gmail',        // Gmail SMTP service 
  auth: {
    user: 'tprabani@gmail.com',  
    pass: 'insa oydr vfsz ahla',     
  },
  tls: {
    rejectUnauthorized: false,     // This allows bypassing SSL certificate validation errors
  },
});

// Function to send an email
const sendDueEmail = (to, subject, text) => {
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

module.exports = sendDueEmail;  // Export the sendDueEmail function for use in other parts of your app


