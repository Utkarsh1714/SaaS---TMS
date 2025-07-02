import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const sendPasswordResetEmail = async ({ email, name, resetLink }) => {
  await transporter.sendMail({
    from: `"Taskify Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset Your Taskify Password",
    html: `
      <h3>Hello ${name},</h3>
      <p>You requested to reset your password. Click the button below:</p>
      <a href="${resetLink}" style="padding:10px 20px;background:#facc15;color:#000;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
};

export const sendWelcomeEmail = async ({ email, name, role, tempPassword, resetLink }) => {
    await transporter.sendMail({
    from: `"Taskify Team" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to Taskify - Your Credentials",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome, ${name} 👋</h2>
        <p>You have been registered as a <strong>${role}</strong> in your organization on <strong>Taskify</strong>.</p>
        
        <p><strong>Temporary Password:</strong> <code>${tempPassword}</code></p>
        <p>Please click the button below to reset your password and activate your account:</p>
        
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background-color:#facc15;color:black;text-decoration:none;border-radius:5px;">Set New Password</a>
        <p><strong>Please note that this link will be expires in 15 minutes.</strong></p>

        <p>If you did not expect this email, you can safely ignore it.</p>
        <p>– The Taskify Team</p>
      </div>
    `,
  });
}