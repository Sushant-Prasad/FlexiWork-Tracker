import axios from "axios";

/*
==================================================
PROJECT API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for project management requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by project service functions.

Business Logic:
Centralizes configuration to keep all requests consistent.
==================================================
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api",
});

/*
==================================================
API ERROR NORMALIZATION
--------------------------------------------------
API:
N/A

Access:
N/A

Purpose:
Extracts backend error messages and falls back to a safe default.

Workflow:
Reads error.response.data.message and returns fallback when absent.

Payload:
- error: Axios error object
- fallbackMessage: string

Return:
User-friendly error message string.

Business Logic:
Keeps UI messaging consistent across all project calls.
==================================================
*/
const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || fallbackMessage;
};

/*
==================================================
AUTH HEADER BUILDER
--------------------------------------------------
API:
N/A

Access:
Token is required for protected routes

Purpose:
Creates the Authorization header for secured endpoints.

Workflow:
Wraps a Bearer token into Axios request headers.

Payload:
- token: JWT access token

Return:
Axios config object containing headers.

Business Logic:
Ensures all protected calls include consistent auth metadata.
==================================================
*/
const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/*
==================================================
CREATE PROJECT
--------------------------------------------------
API:
POST /api/projects

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Creates a new project and optionally assigns it to a team.

Workflow:
Sends project details and returns the created project.

Payload:
{
  title,
  description?,
  assignedTeam?,
  startDate?,
  deadline?,
  status?
}

Return:
Created project record from the backend.

Business Logic:
Allows managers/admins to track initiatives and ownership.
==================================================
*/
export const createProject = async (payload, token) => {
  try {
    const response = await api.post("/projects", payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create project"));
  }
};

/*
==================================================
GET PROJECTS
--------------------------------------------------
API:
GET /api/projects

Access:
Authenticated users

Purpose:
Fetches the list of projects visible to the user.

Workflow:
Calls the projects endpoint and returns the collection.

Payload:
N/A

Return:
Project list and related metadata from the backend.

Business Logic:
Supports dashboards and project selection in the UI.
==================================================
*/
export const getProjects = async (token) => {
  try {
    const response = await api.get("/projects", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch projects"));
  }
};

/*
==================================================
UPDATE PROJECT
--------------------------------------------------
API:
PATCH /api/projects/:id

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Updates project fields such as status, dates, or assignment.

Workflow:
Sends patch fields by project id and returns the updated project.

Payload:
{
  title?,
  description?,
  assignedTeam?,
  startDate?,
  deadline?,
  status?
}

Return:
Updated project record from the backend.

Business Logic:
Keeps project lifecycle accurate for reporting and planning.
==================================================
*/
export const updateProject = async (projectId, payload, token) => {
  try {
    const response = await api.patch(`/projects/${projectId}`, payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update project"));
  }
};

/*
==================================================
DELETE PROJECT
--------------------------------------------------
API:
DELETE /api/projects/:id

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Removes a project from the system.

Workflow:
Calls delete by project id and returns confirmation.

Payload:
Path param:
- id (projectId)

Return:
Deletion result from the backend.

Business Logic:
Used for cleanup when a project is canceled or created by mistake.
==================================================
*/
export const deleteProject = async (projectId, token) => {
  try {
    const response = await api.delete(`/projects/${projectId}`, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete project"));
  }
};
