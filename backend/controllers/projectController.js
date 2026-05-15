import Project from "../models/Project.js"; // Project model
import Team from "../models/Team.js"; // Team model
import { canDeleteProject, canManageProject } from "../utils/projectPermissions.js"; // Permission checks
import { isValidProjectTransition } from "../utils/projectStatusFlow.js"; // Status transitions
import { validateProjectData } from "../utils/projectValidation.js"; // Project validation

// Create a new project (manager/admin only)
export const createProject = async (req, res) => {
  try {
    const { title, description, assignedTeam, startDate, deadline, status } = req.body || {};

    if (!canManageProject(req.user?.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const validation = validateProjectData(req.body, { isUpdate: false });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: validation.errors });
    }

    if (!title || String(title).trim().length < 2) {
      return res
        .status(400)
        .json({ success: false, message: "title is required and must be at least 2 characters" });
    }

    const existing = await Project.findOne({ title: String(title).trim() }); // Duplicate title check
    if (existing) {
      return res.status(409).json({ success: false, message: "Project title already exists" });
    }

    const team = await Team.findById(assignedTeam); // Validate team
    if (!team) {
      return res.status(404).json({ success: false, message: "Assigned team not found" });
    }

    const project = await Project.create({
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      createdBy: req.user._id, // Track creator
      assignedTeam: assignedTeam || null,
      startDate: startDate || null,
      deadline: deadline || null,
      status: status || "PLANNING",
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to create project" });
  }
};

// Get all projects (authenticated users)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email") // Include creator details
      .populate("assignedTeam", "name site") // Include team details
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to fetch projects" });
  }
};

// Update a project (manager/admin only)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id); // Load project
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (!canManageProject(req.user?.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { title, description, assignedTeam, startDate, deadline, status } = req.body || {};

    const validation = validateProjectData(req.body, { isUpdate: true });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: validation.errors });
    }

    if (title !== undefined) {
      const trimmed = String(title).trim(); // Normalize title
      if (trimmed.length < 2) {
        return res
          .status(400)
          .json({ success: false, message: "title must be at least 2 characters" });
      }
      const existing = await Project.findOne({ title: trimmed, _id: { $ne: project._id } });
      if (existing) {
        return res.status(409).json({ success: false, message: "Project title already exists" });
      }
      project.title = trimmed;
    }

    if (description !== undefined) {
      project.description = description ? String(description).trim() : "";
    }

    if (assignedTeam !== undefined) {
      if (assignedTeam) {
        const team = await Team.findById(assignedTeam); // Validate team
        if (!team) {
          return res.status(404).json({ success: false, message: "Assigned team not found" });
        }
      }
      project.assignedTeam = assignedTeam || null;
    }

    if (startDate !== undefined) {
      project.startDate = startDate || null;
    }

    if (deadline !== undefined) {
      project.deadline = deadline || null;
    }

    if (status !== undefined) {
      const allowed = isValidProjectTransition(project.status, status);
      if (!allowed) {
        return res.status(400).json({ success: false, message: "Invalid status transition" });
      }
      project.status = status; // Apply status change
    }

    const updated = await project.save(); // Persist updates

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updated,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to update project" });
  }
};

// Delete a project (manager/admin only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id); // Load project
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (!canDeleteProject(req.user?.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Project.deleteOne({ _id: project._id }); // Remove project

    return res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to delete project" });
  }
};
