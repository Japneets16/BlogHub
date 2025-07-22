const nodemailer = require('nodemailer');

//feature 3: send welcome email*
const sendWelcomeEmail = async (email, name) => {
  try {
    //create email transporter*
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    //email options*
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Our Blogging Platform!',
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Thank you for joining our blogging platform.</p>
        <p>Start your blogging journey today!</p>
      `
    };

    //send email*
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log('Email error:', err);
    return false;
  }
};

//feature 3: send password reset email*
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log('Reset email error:', err);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail
};
