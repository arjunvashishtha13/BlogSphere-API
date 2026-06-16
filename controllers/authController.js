const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  avatar: user.avatar,
  website: user.website,
  github: user.github,
  twitter: user.twitter,
  linkedin: user.linkedin,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    isVerified: false,
  });

  // Attempt to send verification email (non-blocking if email not configured)
  const emailSent = await sendVerificationEmail(email, verificationToken);

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    user: formatUser(user),
    token,
    emailVerificationSent: emailSent,
    message: emailSent
      ? 'Account created. Please check your email to verify your account.'
      : 'Account created successfully.',
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (user.isBanned) {
    throw new AppError('Your account has been suspended', 403);
  }

  // Warn if email is not verified but still allow login
  const token = signToken(user._id);

  res.json({
    success: true,
    user: formatUser(user),
    token,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
  if (!user) {
    throw new AppError('Invalid or expired verification token', 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ success: true, message: 'Email verified successfully' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether user exists
    return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  await sendPasswordResetEmail(email, resetToken);

  res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successfully' });
});

const resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+verificationToken');
  if (!user) throw new AppError('User not found', 404);

  if (user.isVerified) {
    return res.json({ success: true, message: 'Email is already verified' });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationToken = verificationToken;
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user.email, verificationToken);

  res.json({ success: true, message: 'Verification email sent' });
});

module.exports = { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, resendVerification };
