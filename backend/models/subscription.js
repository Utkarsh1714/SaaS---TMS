import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    planId: {
      type: String,
      enum: ["free", "premium", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "past_due", "canceled", "trialing"],
      default: "active",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    startDate: { type: Date, default: Date.now },
    currentPeriodEnd: { type: Date }, // When does the current access expire?
    razorpaySubscriptionId: { type: String }, // If using recurring billing later
  },
  { timestamps: true }
);

// Compound index for super fast lookups
SubscriptionSchema.index({ organizationId: 1, status: 1 });

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;
