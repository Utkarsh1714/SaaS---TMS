import mongoose from "mongoose";
import Permission from "./Permission.model.js";

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});

const Role = mongoose.model("Role", RoleSchema);

export default Role;
