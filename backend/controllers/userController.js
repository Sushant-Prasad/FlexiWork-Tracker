import User from "../models/User.js"; // User model
import Team from "../models/Team.js"; // Team model

// Validate timezone using Intl API
const isValidTimezone = (timezone) => {
	if (!timezone) return false;
	try {
		Intl.DateTimeFormat("en-US", { timeZone: timezone }); // Throws on invalid timezone
		return true;
	} catch (error) {
		return false;
	}
};

// Validate avatar URL using URL constructor
const isValidUrl = (value) => {
	if (!value) return false;
	try {
		// Accept http(s) or relative URLs based on needs
		const url = new URL(value, "http://example.com");
		return !!url;
	} catch (error) {
		return false;
	}
};

// GET /api/users/me - fetch logged-in user profile
export const getProfile = async (req, res) => {
	try {
		const userId = req.user?._id; // Authenticated user id
		if (!userId) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const user = await User.findById(userId)
			.select("-password") // Exclude password
			.populate("teamId", "name site"); // Add team details

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		return res.status(200).json({ success: true, data: user });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch profile" });
	}
};

// PATCH /api/users/update - update profile fields
export const updateProfile = async (req, res) => {
	try {
		const userId = req.user?._id; // Authenticated user id
		if (!userId) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const user = await User.findById(userId); // Load user for update
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		const { name, avatarUrl, timezone, settings } = req.body || {};

		if (name !== undefined) {
			const trimmed = String(name).trim(); // Normalize name
			if (trimmed.length < 2) {
				return res
					.status(400)
					.json({ success: false, message: "Name must be at least 2 characters" });
			}
			user.name = trimmed; // Apply name update
		}

		if (avatarUrl !== undefined) {
			if (avatarUrl && !isValidUrl(avatarUrl)) {
				return res.status(400).json({ success: false, message: "avatarUrl is invalid" });
			}
			user.avatarUrl = avatarUrl || ""; // Allow clearing avatar
		}

		if (timezone !== undefined) {
			if (!isValidTimezone(timezone)) {
				return res.status(400).json({ success: false, message: "timezone is invalid" });
			}
			user.timezone = timezone; // Apply timezone update
		}

		if (settings !== undefined) {
			if (settings.geoCheckOptIn !== undefined) {
				if (typeof settings.geoCheckOptIn !== "boolean") {
					return res
						.status(400)
						.json({ success: false, message: "settings.geoCheckOptIn must be boolean" });
				}
				user.settings.geoCheckOptIn = settings.geoCheckOptIn; // Apply geo preference
			}

			if (settings.editCutoffHour !== undefined) {
				const cutoff = Number(settings.editCutoffHour); // Normalize cutoff value
				if (Number.isNaN(cutoff) || cutoff < 0 || cutoff > 23) {
					return res
						.status(400)
						.json({ success: false, message: "settings.editCutoffHour must be 0-23" });
				}
				user.settings.editCutoffHour = cutoff; // Apply cutoff hour
			}
		}

		const updated = await user.save(); // Persist changes

		const sanitized = updated.toObject(); // Prepare response
		delete sanitized.password; // Ensure password is not returned

		return res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: sanitized,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to update profile" });
	}
};

// GET /api/users/team - list members of the user's team
export const getTeamMembers = async (req, res) => {
	try {
		const user = req.user; // Authenticated user
		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		if (!user.teamId) {
			return res.status(404).json({ success: false, message: "User has no team" });
		}

		// Fetch team to get the definitive managerId
		const team = await Team.findById(user.teamId).populate(
			"managerId",
			"-password"
		);

		// Fetch all users assigned to this team
		const members = await User.find({ teamId: user.teamId })
			.select("-password") // Exclude passwords
			.sort({ name: 1 }); // Sort by name

		// If manager is not in the members list (teamId not set on their User doc),
		// include them separately so the frontend always has manager data.
		const managerInMembers = members.some(
			(m) => m._id.toString() === team?.managerId?._id?.toString()
		);

		const allMembers =
			team?.managerId && !managerInMembers
				? [team.managerId, ...members]
				: members;

		return res.status(200).json({
			success: true,
			count: allMembers.length,
			data: allMembers,
			team: {
				_id: team?._id,
				name: team?.name,
				site: team?.site,
				managerId: team?.managerId?._id, // Just the ID for frontend matching
			},
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch team members" });
	}
};
