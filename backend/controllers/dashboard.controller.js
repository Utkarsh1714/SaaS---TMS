import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const overview = async (req, res) => {
  try {
    const { _id, role, organizationId } = req.user;

    const taskQuery =
      role === "Boss"
        ? { organizationId: new mongoose.Types.ObjectId(organizationId) }
        : { $or: [{ assignedManager: _id }, { assignedEmployees: _id }] };

    // Task count query
    const taskCount = await Task.countDocuments(taskQuery);

    // Active user count query
    const activeUser = await User.countDocuments({
      organizationId: organizationId,
      status: "Active",
    });

    // Overdue task count query
    const now = new Date();
    const overdueQuery = {
      ...taskQuery,
      deadline: { $lt: now },
      status: { $ne: "Completed" },
    };
    const overdueTaskCount = await Task.countDocuments(overdueQuery);

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

    // Task status count
    const statusResult = await Task.aggregate([
      // Stage 1: Match task based on same user-role logic
      {
        $match: taskQuery,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskStatusCount = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    statusResult.forEach((result) => {
      if (result._id === "Pending") taskStatusCount.pending = result.count;
      if (result._id === "In Progress")
        taskStatusCount.inProgress = result.count;
      if (result._id === "Completed") taskStatusCount.completed = result.count;
    });

    // Task priority count
    const priorityResult = await Task.aggregate([
      // Stage 1: Match task based on same user-role logic
      {
        $match: taskQuery,
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityCount = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    priorityResult.forEach((result) => {
      if (result._id === "Low") taskPriorityCount.Low = result.count;
      if (result._id === "Medium") taskPriorityCount.Medium = result.count;
      if (result._id === "High") taskPriorityCount.High = result.count;
    });

    // Employees count by department
    const departmentCount = await User.aggregate([
      // Stage 1: Find all users excluding the Boss
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          role: { $ne: "Boss" },
          departmentId: { $ne: null },
        },
      },
      // Stage 2: Group users by department and count them
      {
        $group: {
          _id: "$departmentId",
          employeeCount: { $sum: 1 },
        },
      },
      // Stage 3: Join with the 'departments' collections to get department names
      {
        $lookup: {
          from: "departments", // The collection to join with
          localField: "_id", // Field from the input documents (the departmentId)
          foreignField: "_id", // Field from the documents of the "from" collection
          as: "departmentInfo", // Output array field name
        },
      },
      // Stage 4: Clean up the output to get more readable results
      {
        $project: {
          _id: 0,
          departmentName: { $arrayElemAt: ["$departmentInfo.name", 0] }, // Get the first element of the departmentInfo array
          employeeCount: 1, // Include the employee count
        },
      },
      // Stage 5: Remove the results where department was not found
      {
        $match: {
          departmentName: { $ne: null },
        },
      },
    ]);

    res.status(200).json({
      taskCount,
      activeUser,
      overdueTaskCount,
      averageCompletionDays,
      taskStatusCount,
      taskPriorityCount,
      departmentCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch details" });
  }
};

export const getMonthyCompletionTrend = async (req, res) => {
  try {
    const { _id, role, organizationId } = req.user;
    const { year, quarter } = req.query;

    let startDate, endDate;
    const now = new Date();

    if (year && quarter) {
      const startMonth = (parseInt(quarter) - 1) * 3;
      const endMonth = startMonth + 3;
      startDate = new Date(parseInt(year), startMonth, 1);
      endDate = new Date(parseInt(year), endMonth, 1);
    } else {
      endDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 3);
    }

    // Create a dynamic query based on user role
    const matchQuery = {
      status: "Completed",
      updatedAt: { $gte: startDate, $lt: endDate },
    };

    if (role === "Boss") {
      matchQuery.organizationId = new mongoose.Types.ObjectId(organizationId);
    } else {
      matchQuery.$or = [{ assignedEmployees: _id }, { assignedManager: _id }];
    }

    const monthlyDate = await Task.aggregate([
      // Stage 1: Use the dynamic match query
      {
        $match: matchQuery,
      },
      // Stage 2: Group by year and month
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
          },
          count: { $sum: 1 },
        },
      },
      // Stage 3: Sort the result chronologically
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // Post-Processing: Fill the missing months
    const monthName = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const trendData = [];
    let currentDate = new Date(startDate);

    const resultMap = new Map();
    monthlyDate.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      resultMap.set(key, item.count);
    });

    while (currentDate < endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are 0-indexed in JavaScript
      const key = `${year}-${month}`;

      trendData.push({
        year: year,
        month: monthName[month - 1],
        count: resultMap.get(key) || 0,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    res.status(200).json(trendData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch monthly completion trend" });
  }
};

export const getUpcomingDeadlines = async (req, res) => {
  try {
    // We only need the organizationId from the logged-in user
    const { organizationId } = req.user;
    const now = new Date();

    // 1. MODIFIED: The query is now always based on the organizationId.
    // The if/else block for checking the user's role has been removed.
    let query = {
      organizationId: new mongoose.Types.ObjectId(organizationId),
    };

    // 2. Add conditions for deadline and status (this part remains the same)
    query.deadline = { $gte: now };
    query.status = { $ne: "Completed" };

    // 3. Execute the query
    const upcomingTasks = await Task.find(query)
      .sort({ deadline: 1 }) // Sorts to show the nearest deadlines first
      .limit(10)            // Shows a maximum of 10 tasks
      .populate("department", "name")
      .populate("assignedManager", "username")
      .select("title deadline status assignedManager department");

    console.log("Fetched all upcoming tasks for the organization:", upcomingTasks);
    res.status(200).json(upcomingTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch upcoming deadlines" });
  }
};