const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: "Musico <noreply@musicohub.in>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Resend Email Error:", err);
  }
};

module.exports = sendEmail;