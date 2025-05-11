// utils/mailer.js
const nodemailer = require('nodemailer');

// Create a transporter for Gmail 
const transporter = nodemailer.createTransport({
  service: 'gmail',        
  auth: {
    user: 'yasho.aapy@gmail.com',  
    pass: 'xhhp xath taie msms',     
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
    html: text,                      // HTML content of the email
  };

  // Send the email using Nodemailer
  return transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent: ' + info.response); 
    })
    .catch(err => {
      console.log('Error sending email: ', err);
    });
};

module.exports = sendEmail;  

