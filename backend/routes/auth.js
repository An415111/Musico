const sendEmail = require('../utils/sendEmail');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/OTP');


// ============================
// STEP 1: SEND OTP
// ============================
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendEmail({
      to: email,
      subject: 'Musico OTP Verification',
      html: `
        <h2>Your OTP is: ${otpCode}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      `
    });

    res.json({ msg: 'OTP sent to your email' });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ msg: 'Error sending OTP' });
  }
});


// ============================
// STEP 2: VERIFY OTP & CREATE USER
// ============================
router.post('/verify-otp', async (req, res) => {
  try {
    const { firstName, lastName, email, password, otp } = req.body;

    if (!firstName || !lastName || !email || !password || !otp) {
      return res.status(400).json({ msg: 'Missing required data' });
    }

    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Double-check user doesn't exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await user.save();

    await Otp.deleteMany({ email });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      msg: 'Account created successfully',
      token,
      user: {
        id: user._id,
        firstName,
        lastName,
        email
      }
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ============================
// LOGIN USER
// ============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});



// ============================
// FORGOT PASSWORD - SEND OTP
// ============================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email not registered' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    await sendEmail({
      to: email,
      subject: 'Musico Password Reset OTP',
      html: `<h2>Your Password Reset OTP: ${otpCode}</h2>
             <p>Valid for 5 minutes.</p>`
    });

    res.json({ msg: 'OTP sent to your email' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error sending OTP' });
  }
});


// ============================
// RESET PASSWORD
// ============================
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    await Otp.deleteMany({ email });

    res.json({ msg: 'Password reset successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});
module.exports = router;