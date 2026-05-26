import axios from "axios";

/*
==================================================
USER API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for user profile requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by user service functions.

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
Keeps UI messaging consistent across all user profile calls.
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
GET MY PROFILE
--------------------------------------------------
API:
GET /api/users/me

Access:
Authenticated users

Purpose:
Fetches the logged-in user's profile.

Workflow:
Calls the profile endpoint and returns the user data.

Payload:
N/A

Return:
User profile object without sensitive fields.

Business Logic:
Provides the identity and team info for UI personalization.
==================================================
*/
export const getMyProfile = async (token) => {
  try {
    const response = await api.get("/users/me", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch profile"));
  }
};

/*
==================================================
UPDATE MY PROFILE
--------------------------------------------------
API:
PATCH /api/users/update

Access:
Authenticated users

Purpose:
Updates profile fields such as name, avatar, timezone, and settings.

Workflow:
Sends partial updates and returns the updated profile.

Payload:
{
  name?,
  avatarUrl?,
  timezone?,
  settings?: {
    geoCheckOptIn?,
    editCutoffHour?
  }
}

Return:
Updated user profile.

Business Logic:
Applies validation rules on the server to keep profile data clean.
==================================================
*/
export const updateMyProfile = async (payload, token) => {
  try {
    const response = await api.patch("/users/update", payload, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update profile"));
  }
};

/*
==================================================
GET MY TEAM MEMBERS
--------------------------------------------------
API:
GET /api/users/team

Access:
Authenticated users

Purpose:
Fetches members of the logged-in user's team.

Workflow:
Calls the team endpoint and returns the member list.

Payload:
N/A

Return:
Team member list with basic profile details.

Business Logic:
Supports team views without exposing other teams' users.
==================================================
*/
export const getMyTeamMembers = async (token) => {
  try {
    const response = await api.get("/users/team", withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch team members"));
  }
};
