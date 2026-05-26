import axios from "axios";

/*
==================================================
NOTIFICATION API CLIENT
--------------------------------------------------
API:
Base URL /api

Access:
Bearer token required for protected endpoints

Purpose:
Creates a dedicated Axios client for notification requests.

Workflow:
Uses VITE_API_URL when provided and falls back to localhost.

Payload:
N/A

Return:
Axios instance used by notification service functions.

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
Keeps UI messaging consistent across all notification calls.
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
GET MY NOTIFICATIONS
--------------------------------------------------
API:
GET /api/notifications/me

Access:
Authenticated users

Purpose:
Fetches the logged-in user's notifications.

Workflow:
Passes pagination query params and returns the list.

Payload:
Query params:
- page?
- limit?

Return:
Paginated notifications and metadata.

Business Logic:
Supports user inbox views and unread counts.
==================================================
*/
export const getMyNotifications = async (params, token) => {
  try {
    const response = await api.get("/notifications/me", {
      ...withAuth(token),
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch notifications"));
  }
};

/*
==================================================
MARK NOTIFICATION AS READ
--------------------------------------------------
API:
PATCH /api/notifications/:id/read

Access:
Authenticated users

Purpose:
Marks a single notification as read.

Workflow:
Calls the read endpoint by notification id and returns the update.

Payload:
Path param:
- id (notificationId)

Return:
Updated notification record.

Business Logic:
Keeps unread counts accurate for user alerts.
==================================================
*/
export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await api.patch(
      `/notifications/${notificationId}/read`,
      null,
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to mark notification as read"));
  }
};

/*
==================================================
MARK ALL NOTIFICATIONS AS READ
--------------------------------------------------
API:
PATCH /api/notifications/read-all

Access:
Authenticated users

Purpose:
Marks all notifications for the user as read.

Workflow:
Calls the read-all endpoint and returns the summary.

Payload:
N/A

Return:
Update summary from the backend.

Business Logic:
Allows bulk clearing of unread badges.
==================================================
*/
export const markAllNotificationsAsRead = async (token) => {
  try {
    const response = await api.patch("/notifications/read-all", null, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to mark all notifications as read"));
  }
};

/*
==================================================
DELETE NOTIFICATION
--------------------------------------------------
API:
DELETE /api/notifications/:id

Access:
Authenticated users

Purpose:
Removes a notification from the user's inbox.

Workflow:
Calls delete by notification id and returns confirmation.

Payload:
Path param:
- id (notificationId)

Return:
Deletion result from the backend.

Business Logic:
Supports cleanup of old or irrelevant alerts.
==================================================
*/
export const deleteNotification = async (notificationId, token) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`, withAuth(token));
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete notification"));
  }
};
