import mongoose from "mongoose";

const ShiftPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  plannedMode: {
    type: String,
    enum: ["REMOTE", "OFFICE", "HYBRID", "OFF"],
    required: true,
  },
  plannedOffice: {
    site: { type: String },
    desk: { type: String },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  locked: { type: Boolean, default: false },
  notes: { type: String, default: "" },
}, { timestamps: true });

// 🧠 Compound index ensures one plan per user per date
ShiftPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

// ⚡ For faster site/date queries (capacity reports)
ShiftPlanSchema.index({ date: 1, "plannedOffice.site": 1 });

export default mongoose.model("ShiftPlan", ShiftPlanSchema);
