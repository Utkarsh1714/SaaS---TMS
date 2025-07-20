import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
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

export const sendWelcomeEmail = async ({
  email,
  name,
  role,
  tempPassword,
  resetLink,
}) => {
  try {
    const result = await transporter.sendMail({
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

    return result;
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    throw new Error("Email failed to send");
  }
};

export const sendTaskNotificationEmail = async ({ title, description, assignedManagerEmail, managerName, priority, deadline }) => {
  await transporter.sendMail({
    from: `"Taskify Notifications" <${process.env.SMTP_USER}>`,
    to: assignedManagerEmail,
    subject: `New Task Assigned: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">🚀 New Task Assigned!</h2>
        </div>
        <div style="padding: 20px;">
          <p>Hi <strong style="color: #4CAF50;">${managerName}</strong>,</p>
          <p>A new task has been assigned to you. Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h4 style="color: #333; margin-top: 0; margin-bottom: 10px;">Task Title: <span style="color: #007bff;">${title}</span></h4>
            <p style="margin-bottom: 5px;"><strong>Description:</strong> ${description}</p>
            <p style="margin-bottom: 5px;"><strong>Priority:</strong> <span style="color: ${priority === 'High' ? '#dc3545' : priority === 'Medium' ? '#ffc107' : '#28a745'}; font-weight: bold;">${priority}</span></p>
            <p style="margin-bottom: 0;"><strong>Deadline:</strong> <span style="font-weight: bold;">${deadline}</span></p>
          </div>
          
          <p>Please log in to Taskify to view and manage your tasks. Stay organized!</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://saas-tms-frontend.onrender.com" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Taskify</a>
          </p>
        </div>
        <div style="background-color: #f0f0f0; color: #777; padding: 15px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Taskify. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};