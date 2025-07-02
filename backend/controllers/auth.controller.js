import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Department from "../models/department.model.js";
import { sendPasswordResetEmail } from "../utils/send.mail.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export const registerOrg = async (req, res) => {
  try {
    const {
      username,
      email,
      contactNo,
      password,
      companyName,
      gstin,
      address,
      city,
      state,
      pincode,
      country,
      logoUrl,
      websiteUrl,
      departments,
    } = req.body;

    if (
      !username?.trim() ||
      !email?.trim() ||
      !contactNo?.trim() ||
      !password?.trim() ||
      !companyName?.trim() ||
      !gstin?.trim() ||
      !address?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !pincode?.toString().trim() ||
      !country?.trim()
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const newOrg = new Organization({
      name: companyName,
      gstin,
      address,
      city,
      state,
      pincode,
      country,
      logoUrl,
      websiteUrl,
      createdBy: null, // This will be set after user creation
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      contactNo,
      password: hashedPassword,
      role: "Boss", // Default role for the organization creator
      organizationId: newOrg._id,
      departmentId: null, // Assuming no department is created at this point
    });

    await newUser.save();

    newOrg.createdBy = newUser._id;
    await newOrg.save();

    if (departments && departments.length > 0) {
      const departmentsDocs = departments.map((dept) => ({
        name: dept,
        organizationId: newOrg._id,
      }));
      await Department.insertMany(departmentsDocs);
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, orgId: newOrg._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    // });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(201).json({
      message: "Organization registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organizationId: newOrg._id,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerOrg:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, organizationId: user.organizationId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  user.status = "Active";
  await user.save();

  const io = req.app.get("io");
  io.to(user.organizationId.toString()).emit("statusUpdate", {
    userId: user._id,
    status: "Active",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
    })
    .json({ message: "Login successful", user });
};

export const logout = async (req, res) => {
  try {
    if (req.user?._id) {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { status: "Inactive" },
        { new: true }
      );

      const io = req.app.get("io");
      io.to(user.organizationId.toString()).emit("statusUpdate", {
        userId: user._id,
        status: "Inactive",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None", // important for cross-origin cookies
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/forget-password?token=${resetToken}`;
    await sendPasswordResetEmail({
      email: user.email,
      name: user.username,
      resetLink,
    });

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    user.resetToken = undefined; // Clear reset token
    user.resetTokenExpires = undefined; // Clear reset token expiration
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
