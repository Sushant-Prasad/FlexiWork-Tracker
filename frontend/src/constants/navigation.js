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

export const NAV_ITEMS = {
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
      label: "Attendance Analytics",
      path: "/manager/attendance-analytics",
      icon: BarChart3,
    },
    {
      label: "Leave Approvals",
      path: "/manager/leaves-approval",
      icon: UserCheck,
    },
  ],

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