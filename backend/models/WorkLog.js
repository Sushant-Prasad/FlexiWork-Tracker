import mongoose from "mongoose"; // MongoDB ODM

// Tracks daily attendance and actual work mode for each user
const WorkLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Each work log belongs to a user
    },
    date: { type: String, required: true }, // YYYY-MM-DD (string for simple range queries)
    actualMode: {
      type: String,
      enum: ["REMOTE", "OFFICE", "HYBRID", "ABSENT", "UNLOGGED"],
      default: "UNLOGGED", // Default until user logs a mode
    },
    checkInAt: { type: Date }, // First check-in time
    checkOutAt: { type: Date }, // Last check-out time
    workedHours: { type: Number, default: 0 }, // Calculated hours for the day
    comments: { type: String, default: "" }, // Optional user notes
    geo: {
      lat: Number, // Latitude captured at check-in
      lon: Number, // Longitude captured at check-in
      capturedAt: Date, // Timestamp when geo was captured
      source: String, // GPS/network/etc
    },
    source: { type: String, enum: ["SELF", "AUTO"], default: "SELF" }, // Entry origin
    editableUntil: { type: Date }, // Cutoff for edits
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// One record per user per date
WorkLogSchema.index({ userId: 1, date: 1 }, { unique: true });

// Faster queries for reporting
WorkLogSchema.index({ date: 1, actualMode: 1 });

export default mongoose.model("WorkLog", WorkLogSchema);
