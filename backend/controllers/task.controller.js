import Task from "../models/task.model.js";
import mongoose from "mongoose";
import User from '../models/user.model.js'
import { sendTaskNotificationEmail } from "../utils/send.mail.js";
import { redisClient } from '../config/redisClient.js'; // 1. Import the Redis client

// Helper function to apply common filtering/sorting logic
const applyTaskFilters = async (
  baseQuery,
  req,
  res,
  noTaskMessage = "No task found"
) => {
  try {
    const { sort, order, status } = req.query;

    const sortOrder = order === "desc" ? -1 : 1;

    let filter = { ...baseQuery };
    let pipeline = [];

    if (status) {
      if (status === "Overdue") {
        filter.deadline = { $lt: new Date() };
        filter.status = { $ne: "Completed" };
      } else {
        filter.status = status;
      }
    }

    if (Object.keys(filter).length > 0) {
        pipeline.push({ $match: filter });
    }

    let tasks;

    if (sort === "priority") {
        pipeline.push({
            $addFields: {
                priorityValue: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$priority", "Low"] }, then: 1 },
                            { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                            { case: { $eq: ["$priority", "High"] }, then: 3 },
                        ],
                        default: 0,
                    },
                },
            },
        });

        pipeline.push({ $sort: { priorityValue: sortOrder } });

        // Add $lookup stages for population
        pipeline.push(
            { $lookup: { from: 'departments', localField: 'department', foreignField: '_id', as: 'department' } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } }
        );
        pipeline.push(
            { $lookup: { from: 'users', localField: 'assignedManager', foreignField: '_id', as: 'assignedManager' } },
            { $unwind: { path: '$assignedManager', preserveNullAndEmptyArrays: true } }
        );
        pipeline.push(
            { $lookup: { from: 'users', localField: 'assignedEmployees', foreignField: '_id', as: 'assignedEmployees' } }
        );
        pipeline.push(
            { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
            { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } }
        );

        // Project to match original populate structure
        pipeline.push({
            $project: {
                _id: 1, // Include _id of the task itself
                title: 1,
                description: 1,
                department: { _id: '$department._id', name: '$department.name' },
                // FIX HERE: Use $createdBy.field, not $$createdBy.field
                createdBy: { _id: '$createdBy._id', username: '$createdBy.username', email: '$createdBy.email' },
                // FIX HERE: Use $assignedManager.field, not $$assignedManager.field
                assignedManager: { _id: '$assignedManager._id', username: '$assignedManager.username', email: '$assignedManager.email' },
                // assignedEmployees still uses $map and $$emp for iteration over the array
                assignedEmployees: { $map: {
                    input: '$assignedEmployees',
                    as: 'emp',
                    in: { _id: '$$emp._id', username: '$$emp.username', email: '$$emp.email', role: '$$emp.role' }
                }},
                priority: 1,
                status: 1,
                deadline: 1,
                milestones: 1,
                dependencies: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        });

        tasks = await Task.aggregate(pipeline);

    } else {
        let sortOptionsForFind = {};
        if (sort === "createdAt") {
            sortOptionsForFind.createdAt = sortOrder;
        } else {
            sortOptionsForFind.createdAt = -1; // Default
        }

        tasks = await Task.find(filter)
            .populate("department", "name")
            .populate("assignedManager", "username email")
            .populate("assignedEmployees", "username email role")
            .populate("createdBy", "username email")
            .sort(sortOptionsForFind);
    }

    res.status(200).json(tasks);

  } catch (error) {
    console.error("Error fetching tasks with filters:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
}; 

export const createTask = async (req, res) => {
  const {
    title,
    description,
    department,
    assignedManager,
    deadline,
    priority,
    milestones = [],
    organizationId
  } = req.body;
  try {
    const manager = await User.findById(assignedManager);
    if (!manager) return res.status(404).json({ message: "Manager not found" });

    const { username, email} = manager;
    console.log({username, email});

    const task = await Task.create({
      title,
      description,
      department,
      assignedManager,
      assignedEmployees: [],
      deadline,
      priority,
      milestones,
      organizationId: req.user.organizationId,
      createdBy: req.user._id,
    });

    if (!task) return res.status(400).json({ message: "Failed to create task" });

    await sendTaskNotificationEmail({
      title,
      description,
      assignedManagerEmail: email,
      managerName: username,
      priority,
      deadline,
    })

    // ✅ Populate department and assignedManager before sending response
    const populatedTask = await Task.findById(task._id)
      .populate("assignedManager", "username email _id")
      .populate("department", "name _id");

    res.status(201).json({ message: "Task created", task: populatedTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const addEmployeeToTask = async (req, res) => {
  const { taskId } = req.params;
  const { employeeIds } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the current user is the assigned manager
    if (task.assignedManager.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to add employees to this task" });
    }

    // Merge existing and new employees, avoiding duplicates
    const existingIds = task.assignedEmployees.map((id) => id.toString());
    const incomingIds = employeeIds.map((id) => id.toString());

    const combinedUniqueIds = [...new Set([...existingIds, ...incomingIds])];

    // Convert back to ObjectIds
    task.assignedEmployees = combinedUniqueIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    await task.save();

    res.status(200).json({
      message: "Employees added to task successfully",
      task,
    });
  } catch (error) {
    console.error("Error adding employees to task:", error);
    res.status(500).json({ message: "Failed to add employees to task" });
  }
};

export const removeEmployeeFromTask = async (req, res) => {
  const { taskId, employeeId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.assignedEmployees = task.assignedEmployees.filter(
      (empId) => empId.toString() !== employeeId
    );

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to remove the employee from task" });
  }
};

// export const updateTaskStatus = async (req, res) => {
//   const { taskId } = req.params;
//   const { status } = req.body;

//   try {
//     const task = await Task.findById(taskId);

//     if (!task) return res.status(404).json({ message: "Task not found" });

//     task.status = status;
//     await task.save();

//     res.status(200).json(task);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Failed to update task status" });
//   }
// };


export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    // === 2. CACHE INVALIDATION LOGIC ===
    console.log('Task updated, starting cache invalidation...');
    
    // Create a set to store unique user IDs to avoid duplicates
    const userIdsToInvalidate = new Set();

    // Add the manager's ID
    if (task.assignedManager) {
      userIdsToInvalidate.add(task.assignedManager.toString());
    }
    // Add all assigned employees' IDs
    if (task.assignedEmployees && task.assignedEmployees.length > 0) {
      task.assignedEmployees.forEach(id => userIdsToInvalidate.add(id.toString()));
    }
    // You might also want to invalidate the cache for the person who created the task
    if (task.createdBy) {
        userIdsToInvalidate.add(task.createdBy.toString());
    }

    if (userIdsToInvalidate.size > 0) {
      // Convert the set of user IDs to an array of cache keys to delete
      const keysToDelete = [...userIdsToInvalidate].flatMap(userId => [
        `cache:${userId}:/api/dashboard/overview-data1`,
        `cache:${userId}:/api/dashboard/overview-data2`,
        `cache:${userId}:/api/dashboard/overview-data3`
      ]);

      try {
        await redisClient.del(keysToDelete);
        console.log(`Successfully invalidated ${keysToDelete.length} cache keys.`);
      } catch (redisError) {
        console.error("Redis error during cache invalidation:", redisError);
      }
    }
    // ===================================

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update task status" });
  }
};

export const addMilestones = async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const newMileStone = { title };
    task.milestones.push(newMileStone);
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add Milestones" });
  }
};

export const updateMilestone = async (req, res) => {
  const { taskId, milestoneIndex } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.milestones[milestoneIndex].completed = true;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update Milestone " });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

export const getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId)
      .populate("department", "name")
      .populate("createdBy", "username email")
      .populate("assignedManager", "username email")
      .populate("assignedEmployees", "username email role");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    console.log("Failed to fetch task by ID:", error);
    res.status(500).json({ message: "Failed to fetch task by ID" });
  }
};

export const getTasksByBoss = async (req, res) => {
  // try {
  //   const task = await Task.find({
  //     createdBy: req.user._id,
  //   })
  //     .populate("department", "name")
  //     .populate("assignedManager", "username email")
  //     .populate("assignedEmployees", "username email role");

  //   if (!task) return res.status(404).json({ message: "No task found" });

  //   res.status(200).json(task);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Failed to fetch task" });
  // }
  await applyTaskFilters(
    { createdBy: req.user._id },
    req,
    res,
    "No tasks created by boss found"
  );
};

export const getTasksByManager = async (req, res) => {
  // try {
  //   const task = await Task.find({ assignedManager: req.user._id })
  //     .populate("department", "name")
  //     .populate("assignedManager", "username email")
  //     .populate("assignedEmployees", "username email role");
  //   if (!task) return res.status(404).json({ message: "No task found" });

  //   res.status(200).json(task);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Failed to fetch task" });
  // }
  await applyTaskFilters(
    { assignedManager: req.user._id },
    req,
    res,
    "No tasks assigned to manager found"
  );
};

export const getTasksByEmployee = async (req, res) => {
  // try {
  //   const task = await Task.find({ assignedEmployees: req.user._id })
  //     .populate("department", "name")
  //     .populate("assignedManager", "username email")
  //     .populate("assignedEmployees", "username email role");
  //   if (!task) return res.status(404).json({ message: "No task found" });

  //   res.status(200).json(task);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Failed to fetch task" });
  // }
  await applyTaskFilters(
    { assignedEmployees: req.user._id },
    req,
    res,
    "No tasks assigned to employee found"
  );
};
