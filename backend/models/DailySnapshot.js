import mongoose from "mongoose"; // MongoDB ODM

// Daily attendance analytics snapshot for dashboards
const DailySnapshotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null, // Optional team-specific snapshot
    },
    site: { type: String, default: null }, // Optional site grouping
    totalPlanned: { type: Number, default: 0 }, // Planned shifts count
    totalLogged: { type: Number, default: 0 }, // Work logs count
    matchedCount: { type: Number, default: 0 }, // Plan vs actual matches
    deviationCount: { type: Number, default: 0 }, // Plan vs actual deviations
    unloggedCount: { type: Number, default: 0 }, // Missing logs
    officeCount: { type: Number, default: 0 }, // Actual OFFICE count
    remoteCount: { type: Number, default: 0 }, // Actual REMOTE count
    hybridCount: { type: Number, default: 0 }, // Actual HYBRID count
    absentCount: { type: Number, default: 0 }, // Actual ABSENT count
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Extra analytics like adherencePct
    computedAt: { type: Date, default: Date.now }, // When snapshot was generated
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

DailySnapshotSchema.index({ date: 1, teamId: 1 }, { unique: true }); // One snapshot per team per day

export default mongoose.model("DailySnapshot", DailySnapshotSchema);
