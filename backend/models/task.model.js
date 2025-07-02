import mongoose from 'mongoose';

const mileStoneSchema = new mongoose.Schema({
    title: String,
    completed: {
        type: Boolean,
        default: false,
    }
});

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, },
    description: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedManager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    prioritiy: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    deadline: Date,
    milestones: [mileStoneSchema],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
}, {
    timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;