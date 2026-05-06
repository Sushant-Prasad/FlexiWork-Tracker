/*
Role Middleware
Purpose
- Restrict access based on user roles.

How it works
- Expects req.user to be set by auth middleware.
- Allows the request only if req.user.role is in the allowed list.
*/

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role; // Extract role from authenticated user (set by authMiddleware)
    if (!role) {
      return res.status(401).json({ message: "Unauthorized" }); // No role found
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" }); // Role not in allowed list
    }

    return next(); // User has a permitted role
  };
};

export default roleMiddleware;
export { roleMiddleware };
