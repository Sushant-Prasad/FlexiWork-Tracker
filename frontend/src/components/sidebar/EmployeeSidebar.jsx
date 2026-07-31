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
Component:
EmployeeSidebar

Props:
- user

Purpose:
Provides the primary navigation menu for
employees. Displays user information,
navigation links, productivity summary,
and logout action.

Used In:
- Employee Layout
- Employee Dashboard
- Employee Portal

Dependencies:
- React Router
- Framer Motion
- Lucide React

Features:
- Animated Sidebar
- User Profile Card
- Active Navigation Highlight
- Productivity Summary
- Logout Button
- Responsive Sidebar Layout

Business Value:
Acts as the central navigation hub for
employees, allowing quick access to all
major modules while displaying useful
profile and productivity information.

Workflow:
1. Render animated sidebar.
2. Display logged-in employee details.
3. Show navigation menu.
4. Highlight current page.
5. Display productivity summary.
6. Provide logout action.

Returns:
Employee navigation sidebar.
==================================================
*/

/*
==================================================
SIDEBAR NAVIGATION LINKS
--------------------------------------------------
Purpose:
Defines all navigation routes available
to employees.

Each object contains:
- title
- path
- icon
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

/*
==================================================
EMPLOYEE SIDEBAR COMPONENT
--------------------------------------------------
Props:
- user

Purpose:
Displays employee profile information,
navigation links, productivity overview,
and logout button.

Returns:
Employee sidebar.
==================================================
*/
const EmployeeSidebar = ({ user }) => {

  return (

    /*
    ==========================================
    SIDEBAR CONTAINER
    ------------------------------------------
    Animated sidebar using Framer Motion.
    Slides into view when mounted.
    ==========================================
    */
    <motion.aside
      initial={{
        x: -50,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
      }}
      className="flex h-full w-[280px] flex-col justify-between overflow-y-auto border-r border-zinc-800 bg-zinc-950 px-5 py-6"
    >

      {/* ======================================
          TOP SECTION
      ====================================== */}
      <div>

        {/* ==================================
            USER PROFILE CARD
            ----------------------------------
            Displays logged-in employee's
            avatar, name, and role.
        ================================== */}
        <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">

          <div className="flex items-center gap-4">

            {/* Employee Avatar */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
              {user?.name?.charAt(0) || "U"}
            </div>

            {/* Employee Details */}
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

        {/* ==================================
            NAVIGATION MENU
            ----------------------------------
            Displays all available employee
            navigation links.
        ================================== */}
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

                {/* Navigation Icon */}
                <Icon
                  size={20}
                  className="transition-transform group-hover:scale-110"
                />

                {/* Navigation Label */}
                <span>
                  {item.title}
                </span>

              </NavLink>

            );

          })}

        </nav>

      </div>

      {/* ======================================
          BOTTOM SECTION
      ====================================== */}
      <div>

        {/* ==================================
            PRODUCTIVITY SUMMARY
            ----------------------------------
            Displays employee's productivity
            percentage for the current week.

            Note:
            Currently hardcoded. Can later be
            replaced with API data.
        ================================== */}
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

        {/* ==================================
            LOGOUT BUTTON
            ----------------------------------
            Ends the current user session.

            Note:
            Attach logout handler when
            authentication is integrated.
        ================================== */}
        <button className="flex w-full items-center gap-4 rounded-2xl border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </motion.aside>

  );

};

export default EmployeeSidebar;