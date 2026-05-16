import mongoose from "mongoose"; // MongoDB ODM

// Notification schema for user alerts and system events
const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Recipient user
    },
    title: {
      type: String,
      required: true, // Notification title
    },
    message: {
      type: String,
      required: true, // Detailed message
    },
    type: {
      type: String,
      enum: [
        "REMINDER",
        "TASK_ASSIGNED",
        "TASK_COMPLETED",
        "LEAVE_APPROVED",
        "LEAVE_REJECTED",
        "MISSING_LOG",
        "PLAN_PUBLISHED",
        "PROJECT_CREATED",
      ],
      required: true, // Notification category
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId, // Related entity (task/leave/project)
    },
    read: {
      type: Boolean,
      default: false, // Unread by default
    },
    readAt: {
      type: Date, // When user opened the notification
    },
    sentAt: {
      type: Date,
      default: Date.now, // When notification was created
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

NotificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model("Notification", NotificationSchema);
