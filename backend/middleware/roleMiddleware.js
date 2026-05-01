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
    const role = req.user?.role;
    if (!role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    return next();
  };
};

export default roleMiddleware;
export { roleMiddleware };
