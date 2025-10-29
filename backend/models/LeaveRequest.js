import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String, enum: ["PTO", "SICK", "WFH"], required: true },
    startDate: { type: String, required: true }, // "YYYY-MM-DD"
    endDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String },
    appliedAt: { type: Date, default: Date.now },
    decisionAt: { type: Date },
  },
  { timestamps: true }
);

LeaveRequestSchema.index({ userId: 1, startDate: 1 });
LeaveRequestSchema.index({ status: 1 });

export default mongoose.model("LeaveRequest", LeaveRequestSchema);
