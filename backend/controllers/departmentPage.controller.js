import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import Department from "../models/department.model.js";

export const getDeptDetailDashboard = async (req, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;
  try {
    const [
      department,
      allEmpOfDept,
      totalEmp,
      activeTask,
      completedTask,
      pendingTask,
    ] = await Promise.all([
      Department.findOne({ _id: id, organizationId: organizationId })
        .populate({
          path: "teams",
          select: "_id name members tasks createdAt",
          populate: {
            path: "tasks",
            select:
              "_id title description createdBy assignedManager priority status deadline milestones createdAt",
          },
          populate: {
            path: "members",
            select: "-resetToken -resetTokenExpires -password -otp -otpExpires",
          },
        })
        .populate(
          "manager",
          "-resetToken -resetTokenExpires -password -otp -otpExpires"
        )
        .populate("task"),
      User.find({ departmentId: id, organizationId: organizationId })
        .select("-resetToken -resetTokenExpires -password -otp -otpExpires")
        .populate("role", "-__v -permissions"),
      User.countDocuments({
        organizationId: organizationId,
        departmentId: id,
      }),

      Task.countDocuments({
        organizationId: organizationId,
        department: id,
        status: "In Progress",
      }),

      Task.countDocuments({
        organizationId: organizationId,
        department: id,
        status: "Completed",
      }),
      Task.countDocuments({
        organizationId: organizationId,
        department: id,
        status: "Pending",
      }),
    ]);

    res.status(200).json({
      department,
      allEmpOfDept,
      totalEmp,
      activeTask,
      completedTask,
      pendingTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while fetching task details" });
  }
};
