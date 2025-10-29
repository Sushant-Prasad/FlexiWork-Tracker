import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "REMINDER",
        "MISSING_LOG",
        "PLAN_PUBLISHED",
        "SYSTEM_ALERT",
        "CUSTOM",
      ],
      required: true,
    },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    read: { type: Boolean, default: false },
    sentAt: { type: Date },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ type: 1, sentAt: -1 });

export default mongoose.model("Notification", NotificationSchema);
