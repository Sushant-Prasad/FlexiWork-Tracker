import axios from "axios";

/*
==================================================
ATTENDANCE API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for attendance reporting requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by attendance service functions.

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
Keeps UI messaging consistent across all attendance calls.
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
GET ADHERENCE REPORT
--------------------------------------------------
API:
GET /api/attendance/adherence

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Compares planned vs actual work modes for a specific date.

Workflow:
Passes the date query param and returns the adherence report.

Payload:
Query params:
- date (YYYY-MM-DD)

Return:
Adherence summary and per-user details.

Business Logic:
Used for compliance reporting and operational insights.
==================================================
*/
export const getAdherenceReport = async (params, token) => {
  try {
    const response = await api.get("/attendance/adherence", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch adherence report"));
  }
};

/*
==================================================
GET EXCEPTIONS REPORT
--------------------------------------------------
API:
GET /api/attendance/exceptions

Access:
MANAGER, SYSTEM_ADMIN

Purpose:
Fetches deviations and unlogged work logs for a specific date.

Workflow:
Passes the date query param and returns the exceptions report.

Payload:
Query params:
- date (YYYY-MM-DD)

Return:
Exception list and summary counts.

Business Logic:
Highlights risk cases for manager review and follow-up.
==================================================
*/
export const getExceptionsReport = async (params, token) => {
  try {
    const response = await api.get("/attendance/exceptions", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch exceptions report"));
  }
};

/*
==================================================
GET ATTENDANCE SUMMARY
--------------------------------------------------
API:
GET /api/attendance/summary

Access:
EMPLOYEE

Purpose:
Returns employee attendance metrics.

Used In:
Employee Attendance Dashboard
==================================================
*/
export const getAttendanceSummary = async (token) => {
  try {
    const response = await api.get("/attendance/summary", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch attendance summary"));
  }
};

/*
==================================================
GET TODAY ATTENDANCE
--------------------------------------------------
API:
GET /api/worklogs/today

Access:
EMPLOYEE

Purpose:
Returns today's attendance log.
==================================================
*/
export const getTodayAttendance = async (token) => {
  try {
    const response = await api.get("/worklogs/today", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch today's attendance"));
  }
};

/*
==================================================
GET ATTENDANCE HISTORY
--------------------------------------------------
API:
GET /api/worklogs/me

Access:
EMPLOYEE

Purpose:
Returns attendance history.
==================================================
*/
export const getAttendanceHistory = async (params, token) => {
  try {
    const response = await api.get("/worklogs/me", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch attendance history"));
  }
};
