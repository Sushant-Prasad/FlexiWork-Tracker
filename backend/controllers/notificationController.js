import Notification from "../models/Notifications.js"; // Notification model

// GET /api/notifications/me - list notifications for the logged-in user
export const getNotifications = async (req, res) => {
	try {
		const userId = req.user?._id; // Authenticated user id
		if (!userId) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}

		const page = Number(req.query?.page || 1); // Pagination page
		const limit = Number(req.query?.limit || 10); // Pagination size
		const skip = (page - 1) * limit; // Offset

		const notifications = await Notification.find({ userId })
			.sort({ createdAt: -1 }) // Latest first
			.skip(skip)
			.limit(limit);

		const unreadCount = await Notification.countDocuments({ userId, read: false });

		return res.status(200).json({
			success: true,
			unreadCount,
			data: notifications,
			page,
			limit,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch notifications" });
	}
};

// PATCH /api/notifications/:id/read - mark a notification as read
export const markAsRead = async (req, res) => {
	try {
		const notification = await Notification.findById(req.params.id); // Load notification
		if (!notification) {
			return res.status(404).json({ success: false, message: "Notification not found" });
		}

		if (String(notification.userId) !== String(req.user._id)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		notification.read = true; // Mark as read
		notification.readAt = new Date(); // Record read time

		await notification.save();

		return res.status(200).json({
			success: true,
			message: "Notification marked as read",
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to mark as read" });
	}
};

// PATCH /api/notifications/read-all - mark all notifications as read
export const markAllAsRead = async (req, res) => {
	try {
		await Notification.updateMany(
			{ userId: req.user._id, read: false },
			{ $set: { read: true, readAt: new Date() } }
		);

		return res.status(200).json({ success: true, message: "All notifications marked as read" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to mark all as read" });
	}
};

// DELETE /api/notifications/:id - delete a notification
export const deleteNotification = async (req, res) => {
	try {
		const notification = await Notification.findById(req.params.id); // Load notification
		if (!notification) {
			return res.status(404).json({ success: false, message: "Notification not found" });
		}

		if (String(notification.userId) !== String(req.user._id)) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		await Notification.deleteOne({ _id: notification._id }); // Remove notification

		return res.status(200).json({ success: true, message: "Notification deleted" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to delete notification" });
	}
};
