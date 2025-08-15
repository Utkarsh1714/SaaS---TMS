import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const overview = async (req, res) => {
  try {
    const { _id, role, organizationId } = req.user;

    // Task count query
    let taskCount = 0;

    if (role === "Boss") {
      taskCount = await Task.countDocuments({ organizationId: organizationId });
    } else {
      taskCount = await Task.countDocuments({
        $or: [{ assignedManager: _id }, { assignedEmployees: _id }],
      });
    }

    // Active user count query
    let activeUser = 0;

    activeUser = await User.countDocuments({
      organizationId: organizationId,
      status: "Active",
    });

    // Overdue task count query
    const now = new Date();

    let query = {
      deadline: { $lt: now }, // Filter for tasks where the deadline is less than (before) now
      status: { $ne: "Completed" }, // Exclude tasks that are already completed
    };

    if (role === "Boss") {
      query.organizationId = organizationId;
    } else {
      query.$or = [{ assignedManager: _id }, { assignedEmployees: _id }];
    }

    const overdueTaskCount = await Task.countDocuments(query);

    // average time (in days) to complete a task in the organization
    // The aggregation pipeline is a seires of stages to process documents.
    let averageCompletionDays = 0;

    const aggregationResult = await Task.aggregate([
      // Stage 1: Filter to get only relevant documents
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "Completed",
        },
      },

      // Stage 2: Calculate the difference betweeen completion and creation date for each task.
      {
        $project: {
          completionDuration: {
            $subtract: ["$updatedAt", "$createdAt"],
          },
        },
      },

      // Stage 3: Group all documents to calculate the average duration
      {
        $group: {
          _id: null,
          averageDurationMillis: { $avg: "$completionDuration" },
        },
      },
    ]);

    if (aggregationResult.length > 0 && aggregationResult[0]) {
      const avgMillis = aggregationResult[0].averageDurationMillis;
      // Convert average milliseconds to days and round to 2 decimal places
      if (avgMillis) {
        averageCompletionDays =
          Math.round((avgMillis / (1000 * 60 * 60 * 24)) * 100) / 100;
      }
    }

    res
      .status(200)
      .json({ taskCount, activeUser, overdueTaskCount, averageCompletionDays });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch details" });
  }
};
