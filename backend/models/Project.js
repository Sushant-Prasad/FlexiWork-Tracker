import mongoose from "mongoose"; // MongoDB ODM

// Project schema to track high-level initiatives and ownership
const ProjectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true, // Project name
			trim: true,
		},
		description: {
			type: String,
			default: "", // Optional summary
			trim: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true, // Creator/owner of the project
		},
		assignedTeam: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
			default: null, // Team assigned to the project
		},
		startDate: {
			type: String,
			default: null, // YYYY-MM-DD
		},
		deadline: {
			type: String,
			default: null, // YYYY-MM-DD
		},
		status: {
			type: String,
			enum: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"],
			default: "PLANNING", // Default lifecycle state
		},
	},
	{ timestamps: true } // Adds createdAt and updatedAt
);

export default mongoose.model("Project", ProjectSchema);
