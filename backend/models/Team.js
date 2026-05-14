import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
    site: { type: String, default: "" }, // e.g., 'BLR-1'
    officeCapacity: { type: Number, default: 0 }, // number of desks for the team/site
  },
  { timestamps: true }
);

TeamSchema.index({ managerId: 1 });
TeamSchema.index({ site: 1 });

export default mongoose.model("Team", TeamSchema);
