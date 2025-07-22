const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Our Blogging Platform!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our Blogging Platform, ${name}!</h2>
          <p>Thank you for joining our community of writers and readers.</p>
          <p>You can now:</p>
          <ul>
            <li>Create and publish your own blog posts</li>
            <li>Follow other writers</li>
            <li>Like and comment on posts</li>
            <li>Build your profile</li>
          </ul>
          <p>Start your blogging journey today!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendNotificationEmail(email, type, data) {
    let subject, html;
    
    switch(type) {
      case 'new_follower':
        subject = `${data.followerName} started following you!`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Follower!</h2>
            <p>${data.followerName} started following you on our blogging platform.</p>
            <p>Check out their profile and connect with them!</p>
          </div>
        `;
        break;
      case 'new_comment':
        subject = `New comment on your post: ${data.postTitle}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Comment!</h2>
            <p>${data.commenterName} commented on your post "${data.postTitle}":</p>
            <blockquote style="border-left: 3px solid #007bff; padding-left: 15px; margin: 15px 0; color: #666;">
              ${data.comment}
            </blockquote>
          </div>
        `;
        break;
      default:
        return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html
    };

    return await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
