import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  const {
    title,
    description,
    department,
    assignedManager,
    deadline,
    priority,
    milestones = [],
  } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      department,
      assignedManager,
      assignedEmployees: [],
      deadline,
      priority,
      milestones,
      createdBy: req.user._id,
    });

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

export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

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
  try {
    const task = await Task.find({
      createdBy: req.user._id
    });
    if (!task) return res.status(404).json({ message: "No task found" });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const getTasksByManager = async (req, res) => {
  try {
    const task = await Task.find({ assignedManager: req.user._id });
    if (!task) return res.status(404).json({ message: "No task found" });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const getTasksByEmployee = async (req, res) => {
  try {
    const task = await Task.find({ assignedEmployees: req.user._id });
    if (!task) return res.status(404).json({ message: "No task found" });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};
