import mongoose from "mongoose";

const CalendarIntegrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: { type: String, enum: ["GOOGLE", "OUTLOOK"], required: true },
    calendarEmail: { type: String, required: true },
    refreshTokenEnc: { type: String, required: true },
    lastSyncAt: { type: Date },
  },
  { timestamps: true }
);

CalendarIntegrationSchema.index({ userId: 1, provider: 1 }, { unique: true });

export default mongoose.model("CalendarIntegration", CalendarIntegrationSchema);
