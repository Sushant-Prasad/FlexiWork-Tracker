import axios from "axios";

/*
==================================================
WORK LOG API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for work log requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by work log service functions.

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
Keeps UI messaging consistent across all work log calls.
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
CREATE OR UPDATE TODAY'S WORK LOG
--------------------------------------------------
API:
POST /api/worklogs

Access:
Authenticated users

Purpose:
Creates a new work log for today or updates the existing one.

Workflow:
Sends work log details and returns the saved record.

Payload:
{
  actualMode?,
  comments?,
  checkInAt?,
  checkOutAt?,
  geo?: { lat?, lon?, capturedAt?, source? }
}

Return:
Created or updated work log from the backend.

Business Logic:
Keeps one record per user per day while allowing progressive updates.
==================================================
*/
export const createOrUpdateWorkLog = async (payload, token) => {
  try {
    const response = await api.post("/worklogs", payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to save work log"));
  }
};

/*
==================================================
UPDATE WORK LOG CHECKOUT
--------------------------------------------------
API:
PATCH /api/worklogs/:id

Access:
Authenticated users

Purpose:
Updates checkout time and comments for a specific work log.

Workflow:
Sends patch fields by work log id and returns the updated record.

Payload:
{
  checkOutAt?,
  comments?
}

Return:
Updated work log from the backend.

Business Logic:
Finalizes the workday data used for attendance and reporting.
==================================================
*/
export const updateWorkLog = async (workLogId, payload, token) => {
  try {
    const response = await api.patch(`/worklogs/${workLogId}`, payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update work log"));
  }
};

/*
==================================================
GET MY WORK LOGS
--------------------------------------------------
API:
GET /api/worklogs/me

Access:
Authenticated users

Purpose:
Fetches the logged-in user's work log history with pagination.

Workflow:
Passes pagination query params and returns the server response.

Payload:
Query params:
- page?
- limit?

Return:
Paginated list of work logs and metadata.

Business Logic:
Supports attendance history views and user self-service reporting.
==================================================
*/
export const getMyWorkLogs = async (params, token) => {
  try {
    const response = await api.get("/worklogs/me", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch work logs"));
  }
};
