import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["success", "failed", "refunded"],
      default: "success",
    },
    razorpayPaymentId: { type: String, required: true, unique: true },
    invoiceUrl: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
