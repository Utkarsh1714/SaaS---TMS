import mongoose from "mongoose";

const RecentActivitySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metaData: {
      type: Object,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RecentActivity = mongoose.model("RecentActivity", RecentActivitySchema);
export default RecentActivity;
