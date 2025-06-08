import nodemailer from "nodemailer";

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} Email sending result
 */
export const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    // Configure your email service
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: `"Baby-Guard" <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Send email
  return await transporter.sendMail(mailOptions);
};
