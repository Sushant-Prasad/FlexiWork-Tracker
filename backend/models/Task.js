import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    title: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "DONE"], default: "OPEN" },
    effortHrs: { type: Number, required: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    source: {
      type: String,
      enum: ["MANUAL", "AUTO", "INTEGRATION"],
      default: "MANUAL",
    },
  },
  { timestamps: true }
);

// one user can have multiple tasks per day
TaskSchema.index({ userId: 1, date: 1 });

export default mongoose.model("Task", TaskSchema);
