const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailOtp = async (to, otp) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Email Verification Code',
    html: `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes.</p>`,
  });
};

module.exports = { sendEmailOtp };
