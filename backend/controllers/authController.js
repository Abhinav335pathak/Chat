const jwt = require('jsonwebtoken');
const generateOtp = require('../utils/generateOtp');
const { sendEmailOtp } = require('../config/mailer');
const User = require('../models/User');

const OTP_SECRET = process.env.OTP_SECRET;

// const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password)
//     return res.status(400).json({ message: 'All fields are required' });

//   const userExists = await User.findOne({ email, isEmailVerified: true });
//   if (userExists)
//     return res.status(400).json({ message: 'User already exists' });

//   const otp = generateOtp();

//   const otpToken = jwt.sign(
//     { name, email, password, otp },
//     OTP_SECRET,
//     { expiresIn: '5m' }
//   );

//   await sendEmailOtp(email, otp);

//   res.json({
//     message: 'OTP sent to email',
//     otpToken
//   });
// };
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user directly
    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: true, // since no OTP
    });

    res.status(201).json({
      message: "User registered successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



const verifyEmailOtp = async (req, res) => {
  const { otp, otpToken } = req.body;

  let decoded;
  try {
    decoded = jwt.verify(otpToken, process.env.OTP_SECRET);
  } catch (err) {
    return res.status(400).json({ message: 'OTP expired or invalid' });
  }

  if (decoded.otp !== otp)
    return res.status(400).json({ message: 'Invalid OTP' });

  const alreadyExists = await User.findOne({ email: decoded.email });
  if (alreadyExists)
    return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({
    name: decoded.name,
    email: decoded.email,
    password: decoded.password,
    isEmailVerified: true,
  });

  res.json({
    message: 'Email verified successfully',
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isEmailVerified)
      return res.status(403).json({ message: 'Please verify your email first' });

    // Check if user is a Google OAuth user (no password)
    if (user.googleId && !user.password) {
      return res.status(403).json({ message: 'Please login with Google' });
    }

    if (password && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
module.exports = {
  registerUser,
  verifyEmailOtp,
  loginUser
};