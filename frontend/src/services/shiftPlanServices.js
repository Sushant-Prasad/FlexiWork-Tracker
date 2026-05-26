import axios from "axios";

/*
==================================================
SHIFT PLAN API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for all shift plan requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by shift plan service functions.

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
Keeps UI messaging consistent across all shift plan calls.
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
CREATE SHIFT PLANS (BULK)
--------------------------------------------------
API:
POST /api/shiftplans/bulk

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Creates multiple shift plans in a single request.

Workflow:
Sends an array of plans and returns the created records.

Payload:
[
  {
    userId,
    date,
    plannedMode,
    plannedOffice?: { site, desk },
    notes?
  }
]

Return:
Bulk creation result from the backend.

Business Logic:
Reduces network calls while backend enforces one plan per user/date.
==================================================
*/
export const createShiftPlans = async (payload, token) => {
  try {
    const response = await api.post("/shiftplans/bulk", payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create shift plans"));
  }
};

/*
==================================================
GET TEAM SHIFT PLANS
--------------------------------------------------
API:
GET /api/shiftplans/team

Access:
Authenticated users (role-based filtering on server)

Purpose:
Fetches team plans by team and date range.

Workflow:
Passes query params and returns the server response list.

Payload:
Query params:
- teamId?
- startDate?
- endDate?

Return:
Shift plan list and related metadata from the backend.

Business Logic:
Supports team visibility rules enforced in the controller.
==================================================
*/
export const getTeamPlans = async (params, token) => {
  try {
    const response = await api.get("/shiftplans/team", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch team plans"));
  }
};

/*
==================================================
UPDATE SHIFT PLAN
--------------------------------------------------
API:
PATCH /api/shiftplans/:id

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Updates a single shift plan record.

Workflow:
Sends patch fields to the server and returns the updated plan.

Payload:
{
  plannedMode?,
  plannedOffice?: { site?, desk? },
  notes?
}

Return:
Updated shift plan from the backend.

Business Logic:
Allows partial updates while preserving unchanged fields.
==================================================
*/
export const updateShiftPlan = async (planId, payload, token) => {
  try {
    const response = await api.patch(`/shiftplans/${planId}`, payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update shift plan"));
  }
};

/*
==================================================
PUBLISH SHIFT PLANS
--------------------------------------------------
API:
POST /api/shiftplans/publish

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Locks plans for a date range and notifies users.

Workflow:
Sends publish criteria and returns publish status.

Payload:
{
  teamId,
  startDate?,
  endDate?
}

Return:
Publish result and any notification summary.

Business Logic:
Prevents further edits after publishing to maintain schedule integrity.
==================================================
*/
export const publishShiftPlans = async (payload, token) => {
  try {
    const response = await api.post("/shiftplans/publish", payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to publish shift plans"));
  }
};

/*
==================================================
DELETE SHIFT PLAN
--------------------------------------------------
API:
DELETE /api/shiftplans/:id

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Removes a shift plan record from the system.

Workflow:
Calls delete by plan id and returns confirmation.

Payload:
Path param:
- id (planId)

Return:
Deletion result from the backend.

Business Logic:
Used for corrections when a plan must be removed entirely.
==================================================
*/
export const deleteShiftPlan = async (planId, token) => {
  try {
    const response = await api.delete(`/shiftplans/${planId}`, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete shift plan"));
  }
};
