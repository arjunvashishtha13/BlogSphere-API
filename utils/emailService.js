const nodemailer = require('nodemailer');

const createTransport = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransport();
  if (!transporter) {
    console.warn('Email service not configured. Skipping email to:', to);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"BlogSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email/${token}`;
  return sendEmail({
    to: email,
    subject: 'Verify your BlogSphere account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111110;">Welcome to BlogSphere!</h2>
        <p style="color: #5c5a54; line-height: 1.6;">
          Please verify your email address to activate your account.
        </p>
        <a href="${url}" style="display: inline-block; background: #b45309; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 16px 0; font-weight: 600;">
          Verify Email
        </a>
        <p style="color: #8a877f; font-size: 13px;">
          This link expires in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;
  return sendEmail({
    to: email,
    subject: 'Reset your BlogSphere password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #111110;">Password Reset</h2>
        <p style="color: #5c5a54; line-height: 1.6;">
          You requested a password reset. Click the button below to choose a new password.
        </p>
        <a href="${url}" style="display: inline-block; background: #b45309; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 16px 0; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #8a877f; font-size: 13px;">
          This link expires in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
