import axios from "axios";

/*
==================================================
TASK API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for task management requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by task service functions.

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
Keeps UI messaging consistent across all task calls.
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
CREATE TASK
--------------------------------------------------
API:
POST /api/tasks

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Creates a new task under a project and assigns it to a user.

Workflow:
Sends task details and returns the created task.

Payload:
{
  projectId,
  title,
  description?,
  assignedTo,
  priority?,
  effortHrs?,
  dueDate?
}

Return:
Created task record from the backend.

Business Logic:
Ensures tasks are tied to projects and accountable owners.
==================================================
*/
export const createTask = async (payload, token) => {
  try {
    const response = await api.post("/tasks", payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create task"));
  }
};

/*
==================================================
GET MY TASKS
--------------------------------------------------
API:
GET /api/tasks/me

Access:
Authenticated users

Purpose:
Fetches tasks assigned to the logged-in user.

Workflow:
Calls the endpoint and returns the task list.

Payload:
N/A

Return:
User-specific task list and related metadata.

Business Logic:
Supports employee task views and personal workload tracking.
==================================================
*/
export const getMyTasks = async (token) => {
  try {
    const response = await api.get("/tasks/me", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch tasks"));
  }
};

/*
==================================================
GET PROJECT TASKS
--------------------------------------------------
API:
GET /api/tasks/project/:projectId

Access:
Authenticated users

Purpose:
Fetches all tasks for a specific project.

Workflow:
Calls the project tasks endpoint and returns the task list.

Payload:
Path param:
- projectId

Return:
Project task list and related metadata.

Business Logic:
Used for project tracking and manager oversight.
==================================================
*/
export const getProjectTasks = async (projectId, token) => {
  try {
    const response = await api.get(`/tasks/project/${projectId}`, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch project tasks"));
  }
};

/*
==================================================
UPDATE TASK
--------------------------------------------------
API:
PATCH /api/tasks/:id

Access:
Authenticated users

Purpose:
Updates task status, notes, priority, or assignment.

Workflow:
Sends patch fields by task id and returns the updated task.

Payload:
{
  status?,
  notes?,
  priority?,
  assignedTo?,
  effortHrs?,
  dueDate?
}

Return:
Updated task record from the backend.

Business Logic:
Supports task lifecycle updates and change requests.
==================================================
*/
export const updateTask = async (taskId, payload, token) => {
  try {
    const response = await api.patch(`/tasks/${taskId}`, payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update task"));
  }
};

/*
==================================================
DELETE TASK
--------------------------------------------------
API:
DELETE /api/tasks/:id

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Removes a task from the system.

Workflow:
Calls delete by task id and returns confirmation.

Payload:
Path param:
- id (taskId)

Return:
Deletion result from the backend.

Business Logic:
Used for cleanup when tasks are created by mistake.
==================================================
*/
export const deleteTask = async (taskId, token) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete task"));
  }
};
