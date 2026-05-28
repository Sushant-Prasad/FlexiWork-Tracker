import axios from "axios";

/*
==================================================
DASHBOARD API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for dashboard requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by dashboard service functions.

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
Keeps UI messaging consistent across all dashboard calls.
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
GET ROLE-AWARE DASHBOARD OVERVIEW
--------------------------------------------------
API:
GET /api/dashboard/overview

Access:
Authenticated users

Purpose:
Fetches a role-specific overview payload used by legacy or shared clients.

Workflow:
Passes optional query filters and returns overview KPIs.

Payload:
Query params:
- teamId?
- startDate? (YYYY-MM-DD)
- endDate? (YYYY-MM-DD)

Return:
Overview KPI object based on the authenticated role.

Business Logic:
Keeps a single endpoint for mixed-role dashboards.
==================================================
*/
export const getDashboardOverview = async (params, token) => {
  try {
    const response = await api.get("/dashboard/overview", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch dashboard overview"));
  }
};

/*
==================================================
GET DASHBOARD HEATMAP
--------------------------------------------------
API:
GET /api/dashboard/heatmap

Access:
Authenticated users

Purpose:
Fetches time-series occupancy/adherence data for charts.

Workflow:
Passes optional date/team filters and returns heatmap rows.

Payload:
Query params:
- teamId?
- startDate? (YYYY-MM-DD)
- endDate? (YYYY-MM-DD)

Return:
Array of daily KPIs for heatmap/line charts.

Business Logic:
Provides chart-ready data for analytics views.
==================================================
*/
export const getDashboardHeatmap = async (params, token) => {
  try {
    const response = await api.get("/dashboard/heatmap", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch dashboard heatmap"));
  }
};

/*
==================================================
GET EMPLOYEE DASHBOARD
--------------------------------------------------
API:
GET /api/dashboard/employee

Access:
EMPLOYEE role

Purpose:
Fetches employee KPIs for personal dashboard views.

Workflow:
Returns today's mode, hours, streak, and assigned tasks.

Payload:
N/A

Return:
Employee dashboard KPI object.

Business Logic:
Supports daily productivity and attendance self-tracking.
==================================================
*/
export const getEmployeeDashboard = async (token) => {
  try {
    const response = await api.get("/dashboard/employee", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch employee dashboard"));
  }
};

/*
==================================================
GET MANAGER DASHBOARD
--------------------------------------------------
API:
GET /api/dashboard/manager

Access:
MANAGER role

Purpose:
Fetches team-level KPIs for manager dashboards.

Workflow:
Passes optional filters and returns adherence and approvals data.

Payload:
Query params:
- teamId?
- startDate? (YYYY-MM-DD)
- endDate? (YYYY-MM-DD)

Return:
Manager dashboard KPI object.

Business Logic:
Provides leadership visibility into team compliance and approvals.
==================================================
*/
export const getManagerDashboard = async (params, token) => {
  try {
    const response = await api.get("/dashboard/manager", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch manager dashboard"));
  }
};

/*
==================================================
GET ADMIN DASHBOARD
--------------------------------------------------
API:
GET /api/dashboard/admin

Access:
SYSTEM_ADMIN role

Purpose:
Fetches organization-level KPIs for admin dashboards.

Workflow:
Passes optional filters and returns company-wide metrics.

Payload:
Query params:
- teamId?
- startDate? (YYYY-MM-DD)
- endDate? (YYYY-MM-DD)

Return:
Admin dashboard KPI object.

Business Logic:
Provides top-level visibility into workforce trends.
==================================================
*/
export const getAdminDashboard = async (params, token) => {
  try {
    const response = await api.get("/dashboard/admin", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch admin dashboard"));
  }
};
