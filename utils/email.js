const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

module.exports = class Email {
  constructor(user, url, generatedPassword) {
    this.to = user.email;
    this.username = user.username;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
    this.generatedPassword = generatedPassword;
    // this.html = body.html;
  }

  newTransport() {
    // Sendgrid

    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });

    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD
    //   }
    // });
  }

  async send(template, subject) {
    // Send the actual email
    let html;

    if (template === 'passwordReset')
      html = `<div>Hi <strong>${
        this.username
      }</strong>, you can reset password here: ${
        this.url
      }. This reset token will no longer be valid in 10 minutes.</div>`;

    if (template === 'welcome')
      html = `<div>Hi <strong>${
        this.username
      }</strong>, it is great to have you as a part of our community.</div>`;

    if (template === 'welcomeFromGoogleLogin')
      html = `<div><p>Hi <strong>${
        this.username
      }</strong>, it is great to have you as a part of our community.</p> <p>Your username is <strong>${
        this.username
      }</strong> and your password is <strong>${
        this.generatedPassword
      }</strong>.</p> <p>This account is auto-generated for you so you have the options to log in with this account or with google. You may change your account information at any time.</p></div>`;

    if (template === 'happyBirthday')
      html = `<div>Hi <strong>${
        this.username
      }</strong>, today is your birthday. I wish you are having a great time.</div>`;

    if (template === 'newEmailConfirmation')
      html = `<div>Hi <strong>${
        this.username
      }</strong>, this is your new email address.</div>`;

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
      // html:
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to our Priders community!');
  }

  async sendWelcomeFromGoogleLogin() {
    await this.send(
      'welcomeFromGoogleLogin',
      'Welcome to our Priders community!'
    );
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes).'
    );
  }

  async sendHappyBirthday() {
    await this.send('happyBirthday', `Happy birthday! ${this.username}.`);
  }

  async sendUserChangedEmail() {
    await this.send('newEmailConfirmation', `This is an email confirmation.`);
  }
};
