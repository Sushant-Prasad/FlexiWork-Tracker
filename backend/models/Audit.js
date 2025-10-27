import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: { type: String, required: true, index: true }, // e.g., UPDATE_SHIFTPLAN
    entity: { type: String, required: true }, // ShiftPlan, WorkLog, Team, User
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    before: { type: mongoose.Schema.Types.Mixed },
    after: { type: mongoose.Schema.Types.Mixed },
    reason: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

AuditSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

export default mongoose.model("Audit", AuditSchema);
