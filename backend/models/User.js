import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["EMPLOYEE", "MANAGER", "ADMIN"],
      default: "EMPLOYEE",
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    settings: {
      geoCheckOptIn: { type: Boolean, default: false },
      editCutoffHour: { type: Number, default: 22 }, // 10 PM local time
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ teamId: 1 });

export default mongoose.model("User", userSchema);
