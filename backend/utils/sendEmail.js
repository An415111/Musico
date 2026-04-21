const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Musico" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("✅ OTP sent to:", to);

  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

// ============================
// SUPPORT EMAIL
// ============================
router.post('/support', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🎵 Musico Support Request from ${name}`,
      html: `
        <div style="font-family:Arial; padding:20px; background:#f4f4f4;">
          <h2 style="color:#1db954;">🎵 New Support Request - Musico</h2>
          <div style="background:white; padding:20px; border-radius:10px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid #1db954;">
              ${message}
            </p>
          </div>
          <p style="font-size:12px; color:gray; margin-top:20px;">
            Reply directly to this email to respond to the user.
          </p>
        </div>
      `
    });

    // ✅ Also send confirmation email to user
    await sendEmail({
      to: email,
      subject: `✅ We received your message - Musico Support`,
      html: `
        <div style="font-family:Arial; padding:20px;">
          <h2 style="color:#1db954;">🎵 Musico Support</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>We have received your message and will get back to you soon!</p>
          <div style="background:#f9f9f9; padding:15px; border-radius:8px; border-left:4px solid #1db954;">
            <p><strong>Your message:</strong></p>
            <p>${message}</p>
          </div>
          <p style="margin-top:20px;">Thanks for reaching out!</p>
          <p><strong>— Musico Team</strong></p>
        </div>
      `
    });

    res.json({ msg: 'Your message has been sent successfully!' });

  } catch (err) {
    console.error("Support email error:", err);
    res.status(500).json({ msg: 'Failed to send message. Try again later.' });
  }
});

module.exports = sendEmail;