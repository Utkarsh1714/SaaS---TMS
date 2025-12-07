// utils/sendgrid.mail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

const { SENDGRID_API_KEY, SENDER_EMAIL, CLIENT_URL } = process.env;

if (!SENDGRID_API_KEY || !SENDER_EMAIL) {
  console.warn("⚠️ Missing SendGrid env vars. Set SENDGRID_API_KEY and SENDER_EMAIL.");
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// simple helper to send
async function sendMail({ to, subject, html, text }) {
  const msg = {
    to,
    from: SENDER_EMAIL,
    subject,
    html,
    text,
  };

  return sgMail.send(msg); // returns a promise
}

/* ----- exported email functions ----- */

export const registrationEmail = async (user, plan, transactionDetails = null) => {
  const isPaid = plan !== "free" && transactionDetails;

  const subject = isPaid
    ? `Payment Receipt - Taskify ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`
    : "Welcome to Taskify!";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background:#2563EB;padding:20px;border-radius:8px 8px 0 0;color:#fff;text-align:center;">
        <h1 style="margin:0;">Taskify</h1>
      </div>
      <div style="padding:20px;">
        <h2>Hello ${user.firstName} ${user.lastName},</h2>
        <p>Thank you for registering your organization <strong>${user.organizationName}</strong> with Taskify.</p>
        <p>Your account is now active. You can log in and start setting up your workspace.</p>
        ${isPaid ? `<h3>Payment Receipt</h3>
          <p>Transaction ID: ${transactionDetails.razorpayPaymentId}</p>
          <p>Amount: ₹${transactionDetails.amount}</p>` : ""}
        <p style="text-align:center;margin-top:30px;">
          <a href="${CLIENT_URL}/login" style="background:#2563EB;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;">Go to Dashboard</a>
        </p>
      </div>
      <div style="background:#f4f4f4;color:#777;padding:15px;text-align:center;font-size:12px;">
        &copy; ${new Date().getFullYear()} Taskify. All rights reserved.
      </div>
    </div>
  `;

  return sendMail({ to: user.email, subject, html: htmlContent });
};

export const sendPasswordResetEmail = async ({ email, name, resetLink }) => {
  const subject = "Reset Your Taskify Password";
  const html = `
    <h3>Hello ${name},</h3>
    <p>You requested to reset your password. Click the button below:</p>
    <a href="${resetLink}" style="padding:10px 20px;background:#facc15;color:#000;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>This link will expire in 15 minutes.</p>
  `;
  return sendMail({ to: email, subject, html });
};

export const sendWelcomeEmail = async ({ email, name, role, tempPassword, resetLink }) => {
  const subject = "Welcome to Taskify - Your Credentials";
  const html = `
    <div style="font-family: Arial, sans-serif;line-height:1.6;">
      <h2>Welcome, ${name} 👋</h2>
      <p>You have been registered as a <strong>${role}</strong> in your organization on <strong>Taskify</strong>.</p>
      <p><strong>Temporary Password:</strong> <code>${tempPassword}</code></p>
      <p>Please click the button below to reset your password and activate your account:</p>
      <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#facc15;color:#000;text-decoration:none;border-radius:5px;">Set New Password</a>
      <p><strong>This link expires in 15 minutes.</strong></p>
      <p>– The Taskify Team</p>
    </div>
  `;
  return sendMail({ to: email, subject, html });
};

export const sendTaskNotificationEmail = async ({ title, description, assignedManagerEmail, managerName, priority, deadline }) => {
  const subject = `New Task Assigned: ${title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <div style="background:#4CAF50;color:#fff;padding:20px;text-align:center;">
        <h2 style="margin:0;">🚀 New Task Assigned!</h2>
      </div>
      <div style="padding:20px;">
        <p>Hi <strong>${managerName}</strong>,</p>
        <p>A new task has been assigned to you:</p>
        <p><strong>${title}</strong></p>
        <p>${description}</p>
        <p><strong>Priority:</strong> ${priority} • <strong>Deadline:</strong> ${deadline}</p>
        <p style="text-align:center;margin-top:20px;"><a href="${CLIENT_URL}" style="background:#4CAF50;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;">Open Taskify</a></p>
      </div>
    </div>
  `;
  return sendMail({ to: assignedManagerEmail, subject, html });
};

export const sendOTPByEmail = async (email, otp) => {
  const subject = "Taskify Password Reset OTP";
  const html = `
    <div style="font-family: Arial, sans-serif;line-height:1.6;">
      <h3>Taskify Password Reset</h3>
      <p>Your one-time password is:</p>
      <div style="font-size:28px;font-weight:bold;padding:10px;border:1px dashed #ccc;text-align:center;">${otp}</div>
      <p>This code is valid for 10 minutes.</p>
    </div>
  `;
  return sendMail({ to: email, subject, html });
};
