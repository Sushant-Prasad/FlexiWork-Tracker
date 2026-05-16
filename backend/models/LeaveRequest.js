import mongoose from "mongoose"; // MongoDB ODM

// Leave request schema to manage PTO/SICK/WFH workflows
const LeaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Employee requesting leave
    },
    type: {
      type: String,
      enum: ["PTO", "SICK", "WFH"],
      required: true, // Leave type
    },
    startDate: { type: String, required: true }, // "YYYY-MM-DD"
    endDate: { type: String, required: true }, // "YYYY-MM-DD"
    reason: { type: String }, // Optional reason
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING", // Default workflow state
    },
    approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Manager/admin approver
    reviewedAt: { type: Date }, // When the request was reviewed
    appliedAt: { type: Date, default: Date.now }, // When the request was submitted
    decisionAt: { type: Date }, // Legacy field for backwards compatibility
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Indexes for faster lookups
LeaveRequestSchema.index({ userId: 1, startDate: 1 });
LeaveRequestSchema.index({ status: 1 });

export default mongoose.model("LeaveRequest", LeaveRequestSchema);
