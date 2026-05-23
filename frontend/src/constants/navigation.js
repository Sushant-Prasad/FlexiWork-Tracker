export const NAV_ITEMS = {
  EMPLOYEE: [
    { label: "Dashboard", path: "/employee/dashboard" },
    { label: "My Tasks", path: "/employee/tasks" },
    { label: "My Attendance", path: "/employee/attendance" },
    { label: "Leaves", path: "/employee/leaves" },
    { label: "Notifications", path: "/employee/notifications" },
  ],
  MANAGER: [
    { label: "Dashboard", path: "/manager/dashboard" },
    { label: "Teams", path: "/manager/teams" },
    { label: "Projects", path: "/manager/projects" },
    { label: "Tasks", path: "/manager/tasks" },
    { label: "Attendance Analytics", path: "/manager/attendance-analytics" },
    { label: "Leaves Approval", path: "/manager/leaves-approval" },
  ],
  SYSTEM_ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Teams", path: "/admin/teams" },
    { label: "Projects", path: "/admin/projects" },
    { label: "System Analytics", path: "/admin/system-analytics" },
    { label: "Settings", path: "/admin/settings" },
  ],
};

export const ROLE_DEFAULT_PATHS = {
  EMPLOYEE: "/employee/dashboard",
  MANAGER: "/manager/dashboard",
  SYSTEM_ADMIN: "/admin/dashboard",
};

export const getRoleDefaultPath = (role) => {
  return ROLE_DEFAULT_PATHS[role] || "/";
};
