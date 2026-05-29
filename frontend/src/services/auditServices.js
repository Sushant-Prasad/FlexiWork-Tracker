import axios from "axios";

/*
==================================================
AUDIT API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for audit requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by audit service functions.

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
Keeps UI messaging consistent across all audit calls.
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
GET AUDIT HISTORY
--------------------------------------------------
API:
GET /api/audits

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Fetches audit entries for compliance and monitoring views.

Workflow:
Returns the audit list sorted by recency on the server.

Payload:
N/A

Return:
Array of audit entries with actor details.

Business Logic:
Keeps audit retrieval centralized for admin and manager screens.
==================================================
*/
export const getAuditHistory = async (token) => {
  try {
    const response = await api.get("/audits", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch audit history"));
  }
};
