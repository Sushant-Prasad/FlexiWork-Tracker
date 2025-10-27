import mongoose from "mongoose";

const DailySnapshotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    site: { type: String, default: null },
    totalPlanned: { type: Number, default: 0 },
    totalLogged: { type: Number, default: 0 },
    matchedCount: { type: Number, default: 0 },
    deviationCount: { type: Number, default: 0 },
    unloggedCount: { type: Number, default: 0 },
    officeCount: { type: Number, default: 0 },
    remoteCount: { type: Number, default: 0 },
    hybridCount: { type: Number, default: 0 },
    absentCount: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    computedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

DailySnapshotSchema.index({ date: 1, teamId: 1 }, { unique: true });

export default mongoose.model("DailySnapshot", DailySnapshotSchema);
