import Task from "../models/Task.js"; // Task model
import Project from "../models/Project.js"; // Project model
import User from "../models/User.js"; // User model
import { canUpdateTaskStatus } from "../utils/taskPermissions.js"; // Role-based status rules
import { TASK_FLOW } from "../utils/taskStatusFlow.js"; // Status transitions
import { calculateCompletionRate } from "../utils/taskAnalytics.js"; // Analytics helpers
import { validateTaskData } from "../utils/taskValidation.js"; // Task validation
import { sendNotification } from "../utils/sendNotification.js"; // Notification helper

// POST /api/tasks - manager creates a task
export const createTask = async (req, res) => {
	try {
		const { projectId, title, description, assignedTo, priority, effortHrs, dueDate } = req.body || {};

		const validation = validateTaskData(req.body, { isUpdate: false });
		if (!validation.isValid) {
			return res.status(400).json({ success: false, message: "Validation failed", errors: validation.errors });
		}

		if (!projectId) {
			return res.status(400).json({ success: false, message: "projectId is required" });
		}

		const project = await Project.findById(projectId); // Validate project
		if (!project) {
			return res.status(404).json({ success: false, message: "Project not found" });
		}

		const employee = await User.findById(assignedTo); // Validate employee
		if (!employee) {
			return res.status(404).json({ success: false, message: "Assigned user not found" });
		}

		if (!title || String(title).trim().length < 2) {
			return res
				.status(400)
				.json({ success: false, message: "title is required and must be at least 2 characters" });
		}

		const task = await Task.create({
			projectId,
			title: String(title).trim(),
			description: description ? String(description).trim() : "",
			assignedBy: req.user._id, // Manager assigning the task
			assignedTo,
			priority: priority || "MEDIUM",
			effortHrs: effortHrs || 0,
			dueDate: dueDate || null,
		});

		await sendNotification({
			userId: assignedTo,
			title: "New task assigned",
			message: `You have been assigned: ${task.title}.`,
			type: "TASK_ASSIGNED",
			relatedId: task._id,
		});

		return res.status(201).json({
			success: true,
			message: "Task created successfully",
			data: task,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to create task" });
	}
};

const buildAllowedStatusUpdates = (task, user) => {
	const nextStatuses = TASK_FLOW[task.status] || [];
	const assignedToId = task.assignedTo?._id || task.assignedTo;
	const isAssignee = String(assignedToId) === String(user._id);

	return nextStatuses.filter((status) =>
		canUpdateTaskStatus({
			role: user.role,
			currentStatus: task.status,
			newStatus: status,
			isAssignee,
		})
	);
};

const enrichTask = (task, user) => {
	const data = task.toObject({ virtuals: true });
	data.allowedStatusUpdates = buildAllowedStatusUpdates(task, user);
	return data;
};

// GET /api/tasks/me - employee gets own tasks
export const getMyTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ assignedTo: req.user._id })
			.populate("projectId", "title") // Include project title
			.populate("assignedBy", "name") // Include assigner name
			.sort({ createdAt: -1 });

		const enriched = tasks.map((task) => enrichTask(task, req.user));

		return res.status(200).json({ success: true, count: tasks.length, data: enriched });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch tasks" });
	}
};

// GET /api/tasks/analytics - employee task analytics
export const getTaskAnalytics = async (req, res) => {
	try {
		const tasks = await Task.find({ assignedTo: req.user._id });

		const assigned = tasks.length;
		const todo = tasks.filter((task) => task.status === "TODO").length;
		const inProgress = tasks.filter((task) => task.status === "IN_PROGRESS").length;
		const testing = tasks.filter((task) => task.status === "TESTING").length;
		const review = tasks.filter((task) => task.status === "READY_FOR_REVIEW").length;
		const done = tasks.filter((task) => task.status === "DONE").length;
		const completionRate = Math.round(calculateCompletionRate(tasks));

		return res.status(200).json({
			success: true,
			data: {
				assigned,
				todo,
				inProgress,
				testing,
				review,
				done,
				completionRate,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch task analytics",
		});
	}
};

// GET /api/tasks/activity - employee recent task activity
export const getTaskActivity = async (req, res) => {
	try {
		const tasks = await Task.find({ assignedTo: req.user._id })
			.sort({ updatedAt: -1 })
			.limit(5);

		const activity = tasks.map((task) => ({
			id: task._id,
			action: task.updatedAt && task.updatedAt > task.createdAt ? "STATUS_UPDATED" : "TASK_ASSIGNED",
			task: task.title,
			createdAt: task.updatedAt || task.createdAt,
			status: task.status,
		}));

		return res.status(200).json({ success: true, data: activity });
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch task activity",
		});
	}
};

// GET /api/tasks/:id - task detail view
export const getTaskById = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)
			.populate("projectId", "title")
			.populate("assignedBy", "name")
			.populate("assignedTo", "name email");

		if (!task) {
			return res.status(404).json({ success: false, message: "Task not found" });
		}

		const role = req.user?.role;
		const isAssignee = String(task.assignedTo?._id || task.assignedTo) === String(req.user._id);
		const isManager = role === "MANAGER" || role === "SYSTEM_ADMIN";

		if (!isAssignee && !isManager) {
			return res.status(403).json({ success: false, message: "Forbidden" });
		}

		return res.status(200).json({
			success: true,
			data: enrichTask(task, req.user),
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message || "Failed to fetch task details",
		});
	}
};

// GET /api/tasks/project/:projectId - manager sees project tasks
export const getProjectTasks = async (req, res) => {
	try {
		const { projectId } = req.params;
		const tasks = await Task.find({ projectId })
			.populate("assignedTo", "name email") // Include assignee info
			.populate("assignedBy", "name") // Include assigner info
			.sort({ createdAt: -1 });

		return res.status(200).json({ success: true, count: tasks.length, data: tasks });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to fetch project tasks" });
	}
};

// PATCH /api/tasks/:id - update task status or manager fields
export const updateTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id); // Load task
		if (!task) {
			return res.status(404).json({ success: false, message: "Task not found" });
		}

		const role = req.user?.role; // Requester role
		const isAssignee = String(task.assignedTo) === String(req.user._id);
		const isManager = role === "MANAGER" || role === "SYSTEM_ADMIN";

		const { status, notes, priority, assignedTo, effortHrs, dueDate } = req.body || {};

		const validation = validateTaskData(req.body, { isUpdate: true });
		if (!validation.isValid) {
			return res.status(400).json({ success: false, message: "Validation failed", errors: validation.errors });
		}

		const previousStatus = task.status; // Track previous status

		if (status !== undefined) {
			const allowed = canUpdateTaskStatus({
				role,
				currentStatus: task.status,
				newStatus: status,
				isAssignee,
			});
			if (!allowed) {
				return res.status(403).json({ success: false, message: "Status change not allowed" });
			}
			task.status = status; // Apply status update
			if (status === "DONE") {
				task.completedAt = new Date(); // Mark completion time
			} else if (task.completedAt) {
				task.completedAt = null; // Clear completion if moving back
			}
		}

		if (notes !== undefined) {
			if (!isAssignee && !isManager) {
				return res.status(403).json({ success: false, message: "Notes update not allowed" });
			}
			task.notes = notes; // Update notes
		}

		if (isManager) {
			if (priority !== undefined) task.priority = priority; // Manager can change priority
			if (assignedTo !== undefined) {
				const employee = await User.findById(assignedTo); // Validate assignee
				if (!employee) {
					return res.status(404).json({ success: false, message: "Assigned user not found" });
				}
				task.assignedTo = assignedTo; // Manager can reassign
			}
			if (effortHrs !== undefined) task.effortHrs = effortHrs; // Manager can update effort
			if (dueDate !== undefined) task.dueDate = dueDate; // Manager can update due date
		}

		const updated = await task.save(); // Persist updates

		if (status === "DONE" && previousStatus !== "DONE") {
			await sendNotification({
				userId: task.assignedBy,
				title: "Task completed",
				message: `${updated.title} has been marked as DONE.`,
				type: "TASK_COMPLETED",
				relatedId: updated._id,
			});
		}

		return res.status(200).json({
			success: true,
			message: "Task updated successfully",
			data: updated,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to update task" });
	}
};

// DELETE /api/tasks/:id - delete task
export const deleteTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id); // Load task
		if (!task) {
			return res.status(404).json({ success: false, message: "Task not found" });
		}

		await Task.deleteOne({ _id: task._id }); // Remove task

		return res.status(200).json({ success: true, message: "Task deleted successfully" });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: error.message || "Failed to delete task" });
	}
};
