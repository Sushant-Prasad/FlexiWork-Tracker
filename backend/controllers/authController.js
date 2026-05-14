/*
Auth Controller
APIs
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

What this file does
- Registers new users and stores a hashed password (never the plain text).
- Logs users in by validating email + password, then issues a JWT.
- Returns the current user for authenticated requests using req.user.

Assumptions
- JWT_SECRET is set in the environment.
- An auth middleware validates the token and sets req.user.
*/

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Remove sensitive fields before sending user data to clients.
// This prevents password hashes from leaking in API responses.
const sanitizeUser = (userDoc) => {
	const user = userDoc?.toObject ? userDoc.toObject() : { ...userDoc }; // Convert Mongoose doc to plain object
	if (user && user.password) {
		delete user.password; // Remove password hash before sending to client
	}
	return user;
};

// Create a signed JWT for a given user id.
// The token is used by clients to prove authentication on later requests.
const signToken = (userId) => {
	const secret = process.env.JWT_SECRET; // Load JWT signing key from environment
	if (!secret) {
		throw new Error("JWT_SECRET is not set");
	}
	return jwt.sign({ id: userId }, secret, { expiresIn: "7d" }); // Create token valid for 7 days
};

// Register a new user, hash the password, and return token + safe user data.
// Also handles duplicate email checks and missing required fields.
export const registerUser = async (req, res) => {
	try {
		const { name, email, password, role } = req.body || {}; // Extract registration data

		if (!name || !email || !password) {
			return res.status(400).json({ message: "Name, email, and password are required" });
		}

		const allowedRoles = ["EMPLOYEE", "MANAGER", "SYSTEM_ADMIN"];
		const normalizedRole = role ? String(role).trim().toUpperCase() : "EMPLOYEE";
		if (!allowedRoles.includes(normalizedRole)) {
			return res.status(400).json({ message: "Invalid role" });
		}

		const existingUser = await User.findOne({ email }); // Check for duplicate email
		if (existingUser) {
			return res.status(409).json({ message: "Email already in use" });
		}

		const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds = 10
		const user = await User.create({
			name,
			email,
			password: hashedPassword, // Store hashed password, never plain text
			role: normalizedRole,
		});

		const token = signToken(user._id); // Generate JWT for newly registered user
		return res.status(201).json({ token, user: sanitizeUser(user) });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Registration failed" });
	}
};

// Validate credentials and return token + safe user data.
// Fails with 401 for invalid email or password.
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body || {}; // Extract login credentials

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email }); // Look up user by email
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password); // Verify password against hash
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = signToken(user._id); // Generate JWT for authenticated user
		return res.status(200).json({ token, user: sanitizeUser(user) });
	} catch (error) {
		return res.status(500).json({ message: error.message || "Login failed" });
	}
};

// Return the current user based on auth middleware's req.user.
// This endpoint is used to keep the client session in sync.
export const getCurrentUser = async (req, res) => {
	try {
		const userId = req.user?.id || req.user?._id; // Extract user ID from authenticated request
		if (!userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const user = await User.findById(userId); // Fetch fresh user data from database
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({ user: sanitizeUser(user) }); // Return sanitized user object
	} catch (error) {
		return res.status(500).json({ message: error.message || "Failed to fetch user" });
	}
};
