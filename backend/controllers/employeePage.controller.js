import mongoose from "mongoose";
import User from "../models/user.model.js";

export const EmployeeDirectory = async (req, res) => {
  const { organizationId } = req.user;

  if (!organizationId) {
    return res.status(400).json({
      success: false,
      message: "Organization ID is required.",
    });
  }

  try {
    const departmentCount = await User.aggregate([
      // Stage 1: Find all users excluding the Boss and filter by Organization
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          role: { $ne: "Boss" },
          departmentId: { $ne: null }, // Ensure only users assigned to a department are counted
        },
      },
      // Stage 2: Group users by department and count them
      {
        $group: {
          _id: "$departmentId",
          employeeCount: { $sum: 1 },
        },
      },
      // Stage 3: Join with the 'departments' collection to get department names
      // NOTE: 'departments' must be the exact name of the collection in MongoDB (usually lowercase and pluralized model name)
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "departmentInfo",
        },
      },
      // Stage 4: Clean up the output to get more readable results
      {
        $project: {
          _id: 0, // Exclude the grouping ID
          departmentId: "$_id", // Include the original ID if needed
          // Get the 'name' field from the first element of the departmentInfo array
          departmentName: { $arrayElemAt: ["$departmentInfo.name", 0] },
          employeeCount: 1, // Include the employee count
        },
      },
      // Stage 5: Remove results where department was not found (e.g., if departmentId was invalid/deleted)
      {
        $match: {
          departmentName: { $ne: null },
        },
      },
    ]);

    // 6. Send the successful response
    res.status(200).json({
      data: departmentCount,
    });
  } catch (error) {
    console.error("Error retrieving department employee counts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve department employee counts.",
      error: error.message,
    });
  }
};
