import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  Bell,
  FolderKanban,
  User,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";

/*
==================================================
EMPLOYEE SIDEBAR
--------------------------------------------------
Used for:
- Employee Layout
- Employee Dashboard
- Employee Navigation
==================================================
*/

const sidebarLinks = [
  {
    title: "Dashboard",
    path: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Tasks",
    path: "/employee/tasks",
    icon: ClipboardList,
  },
  {
    title: "Attendance",
    path: "/employee/attendance",
    icon: CalendarCheck,
  },
  {
    title: "Projects",
    path: "/employee/projects",
    icon: FolderKanban,
  },
  {
    title: "Notifications",
    path: "/employee/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    path: "/employee/profile",
    icon: User,
  },
];

const EmployeeSidebar = ({ user }) => {
  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-full w-[280px] flex-col justify-between overflow-y-auto border-r border-zinc-800 bg-zinc-950 px-5 py-6"
    >

      {/* ======================================
          TOP SECTION
      ====================================== */}
      <div>

        {/* User Card */}
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">

          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {user?.name?.charAt(0) || "U"}
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-base font-semibold text-white">
                {user?.name || "Employee"}
              </h2>

              <p className="text-sm text-zinc-400">
                {user?.role || "EMPLOYEE"}
              </p>
            </div>

          </div>

        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          {sidebarLinks.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >

                <Icon
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />

                <span>{item.title}</span>

              </NavLink>
            );
          })}

        </nav>

      </div>

      {/* ======================================
          BOTTOM SECTION
      ====================================== */}
      <div>

        {/* Productivity Card */}
        <div className="mb-5 rounded-2xl border border-zinc-800 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4">

          <h3 className="text-sm font-semibold text-white">
            Productivity
          </h3>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            85%
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            Task completion this week
          </p>

        </div>

        {/* Logout */}
        <button className="flex w-full items-center gap-4 rounded-2xl border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </motion.aside>
  );
};

export default EmployeeSidebar;