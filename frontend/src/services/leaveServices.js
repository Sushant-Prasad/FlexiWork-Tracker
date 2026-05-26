import axios from "axios";

/*
==================================================
LEAVE API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for leave management requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by leave service functions.

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
Keeps UI messaging consistent across all leave calls.
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
CREATE LEAVE REQUEST
--------------------------------------------------
API:
POST /api/leaves

Access:
Authenticated users

Purpose:
Submits a leave request for PTO, SICK, or WFH.

Workflow:
Sends leave details and returns the created request.

Payload:
{
  type,
  startDate,
  endDate,
  reason?
}

Return:
Created leave request from the backend.

Business Logic:
Starts the approval workflow with status set to PENDING.
==================================================
*/
export const createLeaveRequest = async (payload, token) => {
  try {
    const response = await api.post("/leaves", payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create leave request"));
  }
};

/*
==================================================
GET MY LEAVE REQUESTS
--------------------------------------------------
API:
GET /api/leaves/me

Access:
Authenticated users

Purpose:
Fetches leave history for the logged-in user.

Workflow:
Calls the endpoint and returns the user's leave list.

Payload:
N/A

Return:
User leave requests and related metadata.

Business Logic:
Supports personal leave history and status tracking.
==================================================
*/
export const getMyLeaves = async (token) => {
  try {
    const response = await api.get("/leaves/me", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch leave requests"));
  }
};

/*
==================================================
GET PENDING LEAVE REQUESTS
--------------------------------------------------
API:
GET /api/leaves/pending

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Fetches all leave requests awaiting approval.

Workflow:
Calls the pending endpoint and returns the queue.

Payload:
N/A

Return:
Pending leave requests for review.

Business Logic:
Supports manager/admin approval workflows.
==================================================
*/
export const getPendingLeaves = async (token) => {
  try {
    const response = await api.get("/leaves/pending", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch pending leaves"));
  }
};

/*
==================================================
APPROVE LEAVE REQUEST
--------------------------------------------------
API:
PATCH /api/leaves/:id/approve

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Approves a pending leave request.

Workflow:
Calls the approve endpoint by request id and returns the updated record.

Payload:
Path param:
- id (leaveId)

Return:
Updated leave request with APPROVED status.

Business Logic:
Marks the request as approved and stores reviewer metadata.
==================================================
*/
export const approveLeave = async (leaveId, token) => {
  try {
    const response = await api.patch(`/leaves/${leaveId}/approve`, null, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to approve leave request"));
  }
};

/*
==================================================
REJECT LEAVE REQUEST
--------------------------------------------------
API:
PATCH /api/leaves/:id/reject

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Rejects a pending leave request.

Workflow:
Calls the reject endpoint by request id and returns the updated record.

Payload:
Path param:
- id (leaveId)

Return:
Updated leave request with REJECTED status.

Business Logic:
Marks the request as rejected and records the decision time.
==================================================
*/
export const rejectLeave = async (leaveId, token) => {
  try {
    const response = await api.patch(`/leaves/${leaveId}/reject`, null, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to reject leave request"));
  }
};
