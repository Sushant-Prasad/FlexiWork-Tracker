import jwt from "jsonwebtoken";
import User from "../models/User.js";

/*
Auth Middleware
Purpose
- Verify JWT and attach the authenticated user to req.user.

How it works
- Reads token from Authorization header (Bearer <token>) or cookies.
- Verifies token with JWT_SECRET.
- Fetches the user from the database.
- Adds req.user for downstream handlers.
*/

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization; // Authorization: Bearer <token>
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1]; // Extract token portion
  }
  return req.cookies?.token || req.cookies?.jwt || null; // Fallback to cookies
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req); // Read token from header/cookies
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const secret = process.env.JWT_SECRET; // JWT signing key
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET is not set" });
    }

    const payload = jwt.verify(token, secret); // Validate token and decode payload
    const user = await User.findById(payload.id).select("-password"); // Load user without password

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach authenticated user for downstream handlers
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" }); // Token invalid/expired
  }
};

export default authMiddleware;
export { authMiddleware };
