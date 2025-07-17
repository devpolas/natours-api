const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) defined the mail options
  const mailOptions = {
    from: "Polas Chandra Barmon <hello@polas.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
