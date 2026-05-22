import axios from "axios"; // HTTP client

// Axios instance for auth API calls
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Extract a readable error message
const getErrorMessage = (error, fallbackMessage) => {
	return error?.response?.data?.message || fallbackMessage;
};

// Register a new user
export const registerUser = async ({ name, email, password, role }) => {
	try {
		const response = await api.post("/auth/register", { name, email, password, role });
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessage(error, "Failed to register user"));
	}
};

// Login with email and password
export const loginUser = async ({ email, password }) => {
	try {
		const response = await api.post("/auth/login", { email, password });
		return response.data;
	} catch (error) {
		throw new Error(getErrorMessage(error, "Failed to login"));
	}
};

// Fetch the current authenticated user
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
