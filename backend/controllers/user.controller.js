import User from "../models/user.model.js";
import { sendWelcomeEmail } from "../utils/send.mail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Department from "../models/department.model.js";

export const getAllEmployees = async (req, res) => {
  try {
    const users = await User.find({
      organizationId: req.user.organizationId
    })
      .select("-password")
      .populate({
        path: "departmentId", // The field in the User schema
        select: "name",       // Fields to include from Department
        // The 'as' option renames the field in the output document
        as: "department"
      });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .select("-password -resetToken -resetTokenExpires -__v")
      .populate("departmentId", "name");

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { username, email, contactNo, role, departmentId } = req.body;

    const existingUser = await User.findOne({
      email,
      organizationId: req.user.organizationId,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already registered!" });
    }

    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 🔐 Generate and hash reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    const newEmployee = new User({
      username,
      email,
      contactNo,
      password: hashedPassword,
      role: role || "Employee",
      departmentId,
      organizationId: req.user.organizationId,
      resetToken: hashedResetToken,
      resetTokenExpires,
    });

    await newEmployee.save();
    
    if (role === 'Manager' && departmentId) {
      await Department.findByIdAndUpdate(departmentId, {
        $set: { manager: newEmployee._id }
      })
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${resetToken}`;

    await sendWelcomeEmail({
      email,
      name: username,
      role,
      tempPassword,
      resetLink,
    });

    const populatedEmployee = await User.findById(newEmployee._id)
      .select("-password -resetToken -resetTokenExpires")
      .populate("departmentId", "name");

    return res.status(201).json(populatedEmployee);
  } catch (error) {
    console.error("Error registering employee:", error);

    // MongoDB Duplicate Key Error (email already exists in ANY org)
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({
        message: "This email is already registered in another organization.",
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, departmentId } = req.body;

    const employee = await User.findOne({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    if (employee.role === "Boss") {
      return res.status(403).json({ message: "Cannot modify Boss account" });
    }

    employee.username = username || employee.username;
    employee.role = role || employee.role;
    employee.email = email || employee.email;
    employee.departmentId = departmentId || employee.departmentId;

    await employee.save();

    return res
      .status(200)
      .json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const io = req.app.get("io");

    const employee = await User.findOneAndDelete({
      _id: id,
      organizationId: req.user.organizationId,
    });

    if (!employee)
      return res
        .status(404)
        .json({ message: "Employee not found or unauthorized" });

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error" });
  }
};
