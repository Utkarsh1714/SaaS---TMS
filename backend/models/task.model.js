import mongoose from "mongoose";

const mileStoneSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    assignedManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    assignedEmployees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
      index: true,
    },
    deadline: { type: Date, index: true },
    milestones: [mileStoneSchema],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    // In taskSchema, add this line:
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
