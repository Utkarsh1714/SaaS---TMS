import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});

const Department = mongoose.model("Department", DepartmentSchema);

export default Department;