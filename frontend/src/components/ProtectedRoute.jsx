import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/*
==================================================
PROTECTED ROUTE
--------------------------------------------------
Component:
ProtectedRoute

Props:
- allowedRoles : Array<String>

Purpose:
Protects application routes by ensuring
that only authenticated users with the
required role can access specific pages.

Used In:
App Routing (React Router)

Dependencies:
- React Router DOM
- AuthContext

Authentication Source:
useAuth()

Authorization:
Role-Based Access Control (RBAC)

Supported Roles:
- EMPLOYEE
- MANAGER
- SYSTEM_ADMIN

Features:
- Authentication Guard
- Role-Based Authorization
- Loading State
- Automatic Redirection
- Secure Route Protection

Business Value:
Prevents unauthorized users from accessing
restricted pages and ensures employees,
managers, and administrators can only
access features assigned to their roles.

Workflow:
1. Retrieve authentication state.
2. Wait until authentication finishes.
3. Redirect unauthenticated users to Login.
4. Validate user role.
5. Redirect unauthorized users.
6. Render requested protected page.

Returns:
- Loading Screen
- Redirect Component
- Protected Route (Outlet)
==================================================
*/

const ProtectedRoute = ({ allowedRoles }) => {

  /*
  ==========================================
  AUTHENTICATION CONTEXT
  ------------------------------------------
  Retrieves the authenticated user and
  loading status from AuthContext.

  user:
  Currently logged-in user.

  isLoading:
  Indicates whether authentication
  verification is still in progress.
  ==========================================
  */
  const { user, isLoading } = useAuth();

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Displays a full-screen loading indicator
  while authentication information is
  being validated.

  Business Logic:
  Prevents rendering protected content
  before authentication completes.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-200">
        Loading...
      </div>
    );
  }

  /*
  ==========================================
  AUTHENTICATION GUARD
  ------------------------------------------
  If no authenticated user exists,
  redirect to the Login page.

  Business Logic:
  Prevents unauthenticated access to
  protected routes.
  ==========================================
  */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
  ==========================================
  AUTHORIZATION GUARD
  ------------------------------------------
  Verifies that the authenticated user
  has one of the allowed roles.

  Business Logic:
  Implements Role-Based Access Control
  (RBAC) for secure application access.

  Example:
  allowedRoles={[
      "MANAGER",
      "SYSTEM_ADMIN"
  ]}
  ==========================================
  */
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /*
  ==========================================
  PROTECTED CONTENT
  ------------------------------------------
  Authentication and authorization
  checks passed successfully.

  Business Logic:
  Renders the nested route using React
  Router's Outlet component.
  ==========================================
  */
  return <Outlet />;
};

export default ProtectedRoute;