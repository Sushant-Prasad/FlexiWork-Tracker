import axios from "axios"; // HTTP client

/*
==================================================
AUTH SERVICE LAYER
--------------------------------------------------
Purpose:
Centralized API client for authentication flows.

Why It Exists:
Keeps auth networking and error handling out of
UI components for cleaner, testable code.

Where It Is Used:
- Login page
- Registration page
- AuthContext session bootstrap
==================================================
*/

/*
==================================================
AXIOS INSTANCE
--------------------------------------------------
Purpose:
Shared API client for all auth endpoints.

Workflow:
1) Read base URL from VITE_API_URL.
2) Fall back to local dev API.

Where It Is Used:
All auth service methods below.
==================================================
*/
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api",
});

/*
==================================================
ERROR HANDLER
--------------------------------------------------
Purpose:
Normalize backend errors for UI display.

Workflow:
1) Use error.response.data.message if present.
2) Fall back to a provided message.

Return Value:
String message safe for user-facing toasts.
==================================================
*/
const getErrorMessage = (error, fallbackMessage) => {
	return error?.response?.data?.message || fallbackMessage;
};

/*
==================================================
REGISTER USER
--------------------------------------------------
API:
POST /api/auth/register

Access:
Public

Purpose:
Creates a new user account and returns auth data.

Workflow:
1) Send registration payload to backend.
2) Backend validates and creates user.
3) Return token + sanitized user.

Payload Structure:
{
  name: string,
  email: string,
  password: string,
  role?: "EMPLOYEE" | "MANAGER" | "SYSTEM_ADMIN"
}

Return Value:
{ token, user }

Important Business Logic:
Backend rejects duplicate emails and invalid roles.
==================================================
*/
export const registerUser = async ({ name, email, password, role }) => {
	try {
		const response = await api.post("/auth/register", { name, email, password, role });
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessage(error, "Failed to register user"));
	}
};

/*
==================================================
LOGIN USER
--------------------------------------------------
API:
POST /api/auth/login

Access:
Public

Purpose:
Authenticates a user and returns auth data.

Workflow:
1) Send credentials to backend.
2) Backend verifies password.
3) Return token + sanitized user.

Payload Structure:
{
  email: string,
  password: string
}

Return Value:
{ token, user }

Important Business Logic:
Backend returns 401 for invalid credentials.
==================================================
*/
export const loginUser = async ({ email, password }) => {
	try {
		const response = await api.post("/auth/login", { email, password });
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessage(error, "Failed to login"));
	}
};

/*
==================================================
GET CURRENT USER
--------------------------------------------------
API:
GET /api/auth/me

Access:
Authenticated users only

Purpose:
Fetch the current user session using a JWT.

Workflow:
1) Send Bearer token in Authorization header.
2) Backend verifies token and returns user.

Payload Structure:
None (token in header)

Return Value:
{ user }

Important Business Logic:
Invalid or expired tokens return 401.
==================================================
*/
export const getCurrentUser = async (token) => {
	try {
		const response = await api.get("/auth/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessage(error, "Failed to fetch current user"));
	}
};
