import mongoose from "mongoose";

const WorkLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    actualMode: {
      type: String,
      enum: ["REMOTE", "OFFICE", "HYBRID", "ABSENT", "UNLOGGED"],
      default: "UNLOGGED",
    },
    checkInAt: { type: Date },
    checkOutAt: { type: Date },
    workedHours: { type: Number, default: 0 },
    comments: { type: String, default: "" },
    geo: {
      lat: Number,
      lon: Number,
      capturedAt: Date,
      source: String,
    },
    source: { type: String, enum: ["SELF", "AUTO"], default: "SELF" },
    editableUntil: { type: Date },
  },
  { timestamps: true }
);

// One record per user per date
WorkLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Faster queries for reporting
WorkLogSchema.index({ date: 1, actualMode: 1 });

export default mongoose.model("WorkLog", WorkLogSchema);
