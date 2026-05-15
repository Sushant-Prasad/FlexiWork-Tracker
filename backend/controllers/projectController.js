import Project from "../models/Project.js"; // Project model

// Create a new project (manager/admin only)
export const createProject = async (req, res) => {
  try {
    const { title, description, assignedTeam, startDate, deadline, status } = req.body || {};

    if (!title || String(title).trim().length < 2) {
      return res
        .status(400)
        .json({ success: false, message: "title is required and must be at least 2 characters" });
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

    const { title, description, assignedTeam, startDate, deadline, status } = req.body || {};

    if (title !== undefined) {
      const trimmed = String(title).trim(); // Normalize title
      if (trimmed.length < 2) {
        return res
          .status(400)
          .json({ success: false, message: "title must be at least 2 characters" });
      }
      project.title = trimmed;
    }

    if (description !== undefined) {
      project.description = description ? String(description).trim() : "";
    }

    if (assignedTeam !== undefined) {
      project.assignedTeam = assignedTeam || null;
    }

    if (startDate !== undefined) {
      project.startDate = startDate || null;
    }

    if (deadline !== undefined) {
      project.deadline = deadline || null;
    }

    if (status !== undefined) {
      project.status = status; // Status validation handled in schema/route
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

    await Project.deleteOne({ _id: project._id }); // Remove project

    return res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Failed to delete project" });
  }
};
