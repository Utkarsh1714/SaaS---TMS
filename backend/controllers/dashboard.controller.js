import mongoose from "mongoose";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";

const getInitialMonthlyCountsArray = (year) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return months.map((month) => ({
    month: month,
    year: year,
    Pending: 0,
    Active: 0,
    Completed: 0,
  }));
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const { organizationId } = req.user;
    if (!organizationId) {
      return res.status(401).json({
        message: "Authentication error: Organization ID not found.",
      });
    }

    const orgId = new mongoose.Types.ObjectId(organizationId);
    const now = new Date();

    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    const [
      totalTaskCount,
      activeEmployeeCount,
      overdueTaskCount,
      avgCompletionData,
      monthlyTaskAggregation,
      departmentEmployeeAggregation,
    ] = await Promise.all([
      // 1. Total task count
      Task.countDocuments({ organizationId: orgId }),

      // 2. Active employee count
      User.countDocuments({ organizationId: orgId, status: "Active" }),

      // 3. Overdue task count
      Task.countDocuments({
        organizationId: orgId,
        status: "Overdue",
      }),

      // 4. Avg task completion (days)
      Task.aggregate([
        { $match: { organizationId: orgId, status: "Completed" } },
        {
          $project: {
            durationInDays: {
              $divide: [
                { $subtract: ["$updatedAt", "$createdAt"] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgCompletionDays: { $avg: "$durationInDays" },
          },
        },
      ]),

      // 5. Monthly task status count for full year
      Task.aggregate([
        {
          $match: {
            organizationId: orgId,
            createdAt: { $gte: startOfYear, $lte: endOfYear },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]),

      // 6. Number of employee count in each department
      User.aggregate([
        { $match: { organizationId: orgId } },
        {
          $group: {
            _id: "$departmentId",
            employeeCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "departments",
            localField: "_id",
            foreignField: "_id",
            as: "department",
          },
        },
        {
          $project: {
            _id: 0,
            departmentId: "$_id",
            departmentName: {
              $ifNull: [
                { $arrayElemAt: ["$department.name", 0] },
                "Unassigned",
              ],
            },
            employeeCount: "$employeeCount",
          },
        },
      ]),
    ]);

    // Process Avg Completion
    const avgTaskCompletionDays = avgCompletionData[0]?.avgCompletionDays || 0;

    const monthlyTaskCompletion = getInitialMonthlyCountsArray(currentYear);

    for (const item of monthlyTaskAggregation) {
      const month = item._id.month;
      const status = item._id.status;
      const count = item.count;

      const monthData = monthlyTaskCompletion.find((m) => m.month === month);

      if (monthData) {
        if (status === "In Progress") {
          monthData.Active = count;
        } else if (status === "Completed") {
          monthData.Completed = count;
        } else if (status === "Pending") {
          monthData.Pending = count;
        }
      }
    }

    res.status(200).json({
      totalTaskCount,
      activeEmployeeCount,
      overdueTaskCount,
      avgTaskCompletionDays: parseFloat(avgTaskCompletionDays.toFixed(2)),
      monthlyTaskCompletion: monthlyTaskCompletion,
      departmentEmployeeCounts: departmentEmployeeAggregation,
    });
  } catch (error) {
    console.error("Error in getDashboardAnalytics:", error);
    res.status(500).json({
      message: "Server error while fetching analytics.",
      error: error.message,
    });
  }
};

export const overview = async (req, res) => {
  try {
    const { _id, role, organizationId } = req.user;

    // --- Task Query Setup ---
    const taskQuery =
      role === "Boss"
        ? { organizationId: new mongoose.Types.ObjectId(organizationId) }
        : { $or: [{ assignedManager: _id }, { assignedEmployees: _id }] };

    // --- Base Counts ---
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

    // --- Average Completion Time ---
    let averageCompletionDays = 0;

    const averageCompletionMatch = {
      ...taskQuery, // <-- *** Use the user's scoped taskQuery here ***
      status: "Completed",
    };

    const aggregationResult = await Task.aggregate([
      // Stage 1: Filter to get only relevant documents
      {
        $match: averageCompletionMatch,
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

    // --- Task Status Count (Total) ---
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

    // --- Task Priority Count (Total) ---
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

    // --- Employees Count by Department ---
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

    // ==========================================================
    // --- NEW LOGIC: Monthly Task Completion Data for Chart ---
    // ==========================================================

    const currentYear = now.getFullYear();

    // Start date is January 1st of the current year
    const startOfCurrentYear = new Date(currentYear, 0, 1);

    // We only filter tasks created within the current year
    const monthlyTaskCompletionQuery = {
      ...taskQuery, // Reuse the organization/user-specific filtering
      createdAt: { $gte: startOfCurrentYear },
    };

    const monthlyCompletionData = await Task.aggregate([
      // Stage 1: Filter tasks created in the current calendar year and apply user/organization scope
      {
        $match: monthlyTaskCompletionQuery,
      },

      // Stage 2: Classify each task into one of the three chart categories: Completed, Overdue, or Active
      {
        $addFields: {
          chartStatus: {
            $switch: {
              branches: [
                // 1. Completed
                {
                  case: { $eq: ["$status", "Completed"] },
                  then: "Completed",
                },
                // 2. Overdue (Not completed AND deadline is past)
                {
                  case: {
                    $and: [
                      { $ne: ["$status", "Completed"] },
                      { $lt: ["$deadline", now] },
                    ],
                  },
                  then: "Overdue",
                },
                // 3. Active (The remaining tasks: Pending/In Progress and not overdue)
                {
                  case: {
                    $or: [
                      { $eq: ["$status", "Pending"] },
                      { $eq: ["$status", "In Progress"] },
                    ],
                  },
                  then: "Active",
                },
              ],
              default: "Active",
            },
          },
        },
      },

      // Stage 3: Group by month/year and the newly calculated chartStatus
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            chartStatus: "$chartStatus",
          },
          count: { $sum: 1 },
        },
      },

      // Stage 4: Reshape the data (Group by month/year only)
      {
        $group: {
          _id: {
            month: "$_id.month",
            year: "$_id.year",
          },
          data: {
            $push: {
              status: "$_id.chartStatus",
              count: "$count",
            },
          },
        },
      },

      // Stage 5: Sort chronologically (Jan to Dec)
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },

      // Stage 6: Final Projection
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          data: 1,
        },
      },
    ]);

    // --- Post-Processing to fill missing months and format (Jan-Dec) ---
    const chartDataMap = {};

    // 1. Initialize 12 months of data (Jan to Dec of the current year)
    for (let i = 1; i <= 12; i++) {
      // Loop from month 1 (Jan) to 12 (Dec)
      chartDataMap[`${currentYear}-${i}`] = {
        month: i,
        year: currentYear,
        Completed: 0,
        Active: 0,
        Overdue: 0,
      };
    }

    // 2. Map aggregation results into the initialized structure
    monthlyCompletionData.forEach((item) => {
      const monthKey = `${item.year}-${item.month}`;
      if (chartDataMap[monthKey]) {
        item.data.forEach((s) => {
          // The status is now guaranteed to be 'Completed', 'Overdue', or 'Active'
          chartDataMap[monthKey][s.status] = s.count;
        });
      }
    });

    // Convert the map to a chronologically ordered array (Jan, Feb, ..., Dec)
    const monthlyTaskCompletion = Object.values(chartDataMap);

    // --- Final Response ---
    res.status(200).json({
      taskCount,
      activeUser,
      overdueTaskCount,
      averageCompletionDays,
      taskStatusCount,
      taskPriorityCount,
      departmentCount,
      monthlyTaskCompletion, // <-- The new data for your chart
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

    const upcomingTasks = await Task.find({
      organizationId: organizationId,
      deadline: { $gte: now },
      status: { $ne: "Completed" },
    })
      .sort({ deadline: 1 })
      .populate("department")
      .populate(
        "createdBy",
        "-resetToken -resetTokenExpires -password -otp -otpExpires"
      )
      .populate(
        "assignedManager",
        "-resetToken -resetTokenExpires -password -otp -otpExpires"
      );

    if (!upcomingTasks && upcomingTasks.length === 0)
      return res.status(200).json([]);

    res.status(200).json(upcomingTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch upcoming deadlines" });
  }
};
