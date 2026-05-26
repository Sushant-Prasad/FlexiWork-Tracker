import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User who performed the action
      required: false,
      index: true, // Indexed for fast queries by actor
    },
    action: { type: String, required: true, index: true }, // Action type (e.g., UPDATE_SHIFTPLAN, DELETE_WORKLOG)
    entity: { type: String, required: true }, // Entity type affected (ShiftPlan, WorkLog, Team, User)
    entityId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the affected entity
      required: true,
      index: true, // Indexed for fast queries by entity
    },
    before: { type: mongoose.Schema.Types.Mixed }, // State before the action
    after: { type: mongoose.Schema.Types.Mixed }, // State after the action
    reason: { type: String }, // Optional reason for the change
    metadata: { type: mongoose.Schema.Types.Mixed }, // Additional context (e.g., IP, user agent)
  },
  { timestamps: true }
);

AuditSchema.index({ entity: 1, entityId: 1, createdAt: -1 }); // Compound index for efficient audit history retrieval

export default mongoose.model("Audit", AuditSchema);
