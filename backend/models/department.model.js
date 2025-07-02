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
    }
}, {
    timestamps: true,
});

const Department = mongoose.model("Department", DepartmentSchema);

export default Department;