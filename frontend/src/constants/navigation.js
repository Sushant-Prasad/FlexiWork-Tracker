import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Bell,
  User,
  Users,
  Briefcase,
  CheckSquare,
  BarChart3,
  UserCheck,
  Settings,
  Shield,
  Building2,
  Activity,
} from "lucide-react";

/*
==================================================
APPLICATION NAVIGATION CONFIGURATION
--------------------------------------------------
Purpose:
Defines all navigation menus, default
dashboard routes, and profile routes for
every supported user role in the system.

Used In:
- Sidebar Component
- Navbar Component
- Authentication Flow
- Dashboard Redirection
- Route Navigation

Supported Roles:
- EMPLOYEE
- MANAGER
- SYSTEM_ADMIN

Business Value:
Provides a centralized configuration for
role-based navigation (RBAC), ensuring
users only see modules they are authorized
to access.

Workflow:
1. User logs in.
2. System identifies user role.
3. Navigation menu is loaded from NAV_ITEMS.
4. Sidebar renders menu dynamically.
5. User is redirected to role-specific
   dashboard.
==================================================
*/

/*
==================================================
ROLE-BASED NAVIGATION MENU
--------------------------------------------------
Purpose:
Stores all navigation items for every
application role.

Structure:
{
    ROLE: [
        {
            label,
            path,
            icon
        }
    ]
}

Fields:
label:
Displayed navigation name.

path:
Application route.

icon:
Lucide React icon displayed in Sidebar.

Business Logic:
Centralizes application navigation so
new modules can be added without
modifying Sidebar logic.
==================================================
*/
export const NAV_ITEMS = {

  /*
  ==========================================
  EMPLOYEE NAVIGATION
  ------------------------------------------
  Modules available to Employees.

  Features:
  - Dashboard
  - Task Management
  - Attendance
  - Leave Management
  - Notifications
  - Work Logs
  - Team Members
  - Profile
  ==========================================
  */
  EMPLOYEE: [
    {
      label: "Dashboard",
      path: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Tasks",
      path: "/employee/tasks",
      icon: CheckSquare,
    },
    {
      label: "My Attendance",
      path: "/employee/attendance",
      icon: CalendarDays,
    },
    {
      label: "Leaves",
      path: "/employee/leaves",
      icon: ClipboardList,
    },
    {
      label: "Notifications",
      path: "/employee/notifications",
      icon: Bell,
    },
    {
      label: "Work Logs",
      path: "/employee/worklogs",
      icon: Activity,
    },
    {
      label: "Team Members",
      path: "/employee/team",
      icon: Users,
    },
    {
      label: "Profile",
      path: "/employee/profile",
      icon: User,
    },
  ],

  /*
  ==========================================
  MANAGER NAVIGATION
  ------------------------------------------
  Modules available to Managers.

  Features:
  - Dashboard
  - Team Management
  - Project Management
  - Task Assignment
  - Attendance Analytics
  - Leave Approval
  - Work Logs
  - Notifications
  - Profile
  ==========================================
  */
  MANAGER: [
    {
      label: "Dashboard",
      path: "/manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Teams",
      path: "/manager/teams",
      icon: Users,
    },
    {
      label: "Projects",
      path: "/manager/projects",
      icon: Briefcase,
    },
    {
      label: "Tasks",
      path: "/manager/tasks",
      icon: CheckSquare,
    },
    {
      label: "Attendance",
      path: "/manager/attendance-analytics",
      icon: CalendarDays,
    },
    {
      label: "Leave Approvals",
      path: "/manager/leaves-approval",
      icon: UserCheck,
    },
    {
      label: "Work Logs",
      path: "/manager/worklogs",
      icon: Activity,
    },
    {
      label: "Notifications",
      path: "/manager/notifications",
      icon: Bell,
    },
    {
      label: "Profile",
      path: "/manager/profile",
      icon: User,
    },
  ],

  /*
  ==========================================
  SYSTEM ADMIN NAVIGATION
  ------------------------------------------
  Modules available to System Administrators.

  Features:
  - Dashboard
  - User Management
  - Team Management
  - Project Management
  - Attendance Monitoring
  - Work Log Monitoring
  - Notifications
  - System Analytics
  - Audit Logs
  - Settings
  - Profile
  ==========================================
  */
  SYSTEM_ADMIN: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: User,
    },
    {
      label: "Teams",
      path: "/admin/teams",
      icon: Building2,
    },
    {
      label: "Projects",
      path: "/admin/projects",
      icon: Briefcase,
    },
    {
      label: "Attendance",
      path: "/admin/attendance",
      icon: CalendarDays,
    },
    {
      label: "Work Logs",
      path: "/admin/worklogs",
      icon: Activity,
    },
    {
      label: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      label: "System Analytics",
      path: "/admin/system-analytics",
      icon: BarChart3,
    },
    {
      label: "Audit Logs",
      path: "/admin/audits",
      icon: Shield,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
    {
      label: "Profile",
      path: "/admin/profile",
      icon: User,
    },
  ],
};

/*
==================================================
DEFAULT DASHBOARD ROUTES
--------------------------------------------------
Purpose:
Defines the landing page for each user
role immediately after successful login.

Used In:
- Login Flow
- Protected Routes
- Dashboard Redirection

Business Logic:
Ensures every authenticated user is
redirected to the correct dashboard.
==================================================
*/
export const ROLE_DEFAULT_PATHS = {
  EMPLOYEE: "/employee/dashboard",
  MANAGER: "/manager/dashboard",
  SYSTEM_ADMIN: "/admin/dashboard",
};

/*
==================================================
PROFILE ROUTES
--------------------------------------------------
Purpose:
Stores the profile page route for every
supported user role.

Used In:
- Profile Button
- User Menu
- Navbar
- Sidebar

Business Logic:
Allows profile navigation without
hardcoding routes throughout the
application.
==================================================
*/
export const ROLE_PROFILE_PATHS = {
  EMPLOYEE: "/employee/profile",
  MANAGER: "/manager/profile",
  SYSTEM_ADMIN: "/admin/profile",
};

/*
==================================================
GET DEFAULT DASHBOARD PATH
--------------------------------------------------
Purpose:
Returns the default dashboard route for
the specified user role.

Parameters:
role : String

Returns:
Dashboard route string.

Fallback:
"/"

Business Logic:
Used after authentication to redirect
users to their landing page.
==================================================
*/
export const getRoleDefaultPath = (role) => {
  return ROLE_DEFAULT_PATHS[role] || "/";
};

/*
==================================================
GET PROFILE PATH
--------------------------------------------------
Purpose:
Returns the profile page route for the
specified user role.

Parameters:
role : String

Returns:
Profile page route.

Fallback:
"/"

Business Logic:
Provides centralized role-based profile
navigation throughout the application.
==================================================
*/
export const getRoleProfilePath = (role) => {
  return ROLE_PROFILE_PATHS[role] || "/";
};