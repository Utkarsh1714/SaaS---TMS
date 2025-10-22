import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import Department from "../models/department.model.js";
import { sendOTPByEmail, sendPasswordResetEmail } from "../utils/send.mail.js";
import crypto from "crypto";
import dotenv from "dotenv";
import Payment from "../models/paymentModel.js";
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
        organizationName: newOrg._id,
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
  const user = await User.findOne({ email }).populate(
    "organizationId",
    "name country"
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      organizationId: user.organizationId._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  user.status = "Active";
  await user.save();

  const io = req.app.get("io");
  if (user.organizationId && user.organizationId._id) {
    const orgRoomId = user.organizationId._id.toString();

    io.to(orgRoomId).emit("statusUpdate", {
      userId: user._id.toString(),
      status: "Active",
    });
  }

  const { password: pwd, otp, otpExpires, __v, ...safeUser } = user.toObject();

  res
    .cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // 🔑 Must be true for production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 🔑 Required with `secure: true` for cross-site cookies
    })
    .json({ message: "Login successful", user: safeUser, token: token });
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
      io.to(user.organizationId._id.toString()).emit("statusUpdate", {
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

export const razorpay = async (req, res) => {
  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: amount,
      currency: "INR",
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Server error: Failed to create order.",
    });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_id,
      amount,
    } = req.body;

    // Generate new signature using secret key and received data
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Signature is valid, payment is successful
      const newPayment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plan_id,
        amount,
      });

      await newPayment.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully." });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification.",
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "If the email is registered, you will receive an OTP shortly.",
      });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP expiration time (e.g., 10 minutes from now)
    const tenMinutesFromNow = Date.now() + 10 * 60 * 1000;

    // Hash OTP before saving
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;
    user.otpExpires = tenMinutesFromNow;
    await user.save();

    await sendOTPByEmail(user.email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please check your inbox.",
      email: user.email, // Useful for the next step on the frontend
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error. Failed to send OTP." });
  }
};

export const verifyOTPAndAllowPasswordChange = async (req, res) => {
  try {
    const { email, otp } = req.body; // Expecting both email and the raw OTP code

    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res
        .status(400)
        .json({ message: "No active OTP found for this user." });
    }

    // 1. Check if the OTP has expired
    if (user.otpExpires < Date.now()) {
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // 2. Compare the submitted OTP with the stored hashed OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP submitted." });
    }

    // 3. OTP is valid and matched. Clear the OTP fields immediately.
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // 4. Issue a temporary, short-lived JWT to authorize the password change
    const resetToken = jwt.sign(
      { id: user._id, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" } // Token is valid for 10 minutes
    );

    res.status(200).json({
      message: "OTP verified successfully. You can now set a new password.",
      resetToken: resetToken,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword, resetToken } = req.body;

    // 1. Verify the temporary reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message:
          "Invalid or expired reset session. Please restart the process.",
      });
    }

    // Check if the token is intended for password reset
    if (decoded.purpose !== "password_reset") {
      return res.status(401).json({ message: "Invalid token purpose." });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 3. Save the new password
    await user.save();

    res.status(200).json({
      message: "Password has been successfully updated. You can now login.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Server error. Failed to update password." });
  }
};
