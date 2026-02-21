const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailOtp = async (to, otp) => {
  try {
    await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to,
      subject: "Email Verification Code",
      html: `
        <h2>Your OTP: ${otp}</h2>
        <p>Valid for 5 minutes.</p>
      `,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = { sendEmailOtp };
