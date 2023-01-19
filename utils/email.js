const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter - a service that actually send the email
  // its not node js to send the email, its the service we define here
  const transporter = nodemailer.createTransport({
    // Gmail is not at all good idea for a production app but we can use
    // gmail can only send 500 emails per day:jonas
    // once exceeded it will be marked as a spam
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in Gmail "less secure app"
    // fakes to send emails to real addresses : mailtraps
  });
  // Define the email options
  const mailOptions = {
    from: ' Christopher Olano <test@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
