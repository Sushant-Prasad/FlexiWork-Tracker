import mongoose from "mongoose"; // MongoDB ODM

// Task schema for project assignments and execution
const TaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true, // Task must belong to a project
    },
    title: {
      type: String,
      required: true, // Short task title
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Manager/admin who assigned the task
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Employee responsible for execution
    },
    status: {
      type: String,
      enum: [
        "TODO",
        "IN_PROGRESS",
        "READY_FOR_REVIEW",
        "TESTING",
        "DONE",
        "CHANGES_REQUESTED",
      ],
      default: "TODO", // Default lifecycle state
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM", // Default priority
    },
    effortHrs: {
      type: Number,
      default: 0, // Estimated effort
    },
    dueDate: {
      type: String, // YYYY-MM-DD
    },
    completedAt: {
      type: Date, // When task reached DONE
    },
    notes: {
      type: String, // Task notes or feedback
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Useful indexes for filtering
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ status: 1 });

export default mongoose.model("Task", TaskSchema);
