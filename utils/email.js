const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

// new Email(user, url).sendWelcome() // url can be a reset link
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from =
      process.env.NODE_ENV === 'production'
        ? `Christopher Olano <${process.env.SENDGRID_EMAIL_FROM}>`
        : `Christopher Olano <${process.env.EMAIL_FROM}>`;
  }

  // Create a transporter - a service that actually send the email
  // its not node js to send the email, its the service we define here

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        // Gmail is not at all good idea for a production app but we can use
        // gmail can only send 500 emails per day:jonas
        // once exceeded it will be marked as a spam
        // service: 'Gmail',
        service: 'SendGrid',
        // no need to define host/port since nodemailer already knows it
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
        // Activate in Gmail "less secure app"
        // fakes to send emails to real addresses : mailtraps
      });
    }

    return nodemailer.createTransport({
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
  }

  async send(template, subject) {
    // Render HTML based on the pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText(html),
      html,
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the natours family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 mins)'
    );
  }
};
