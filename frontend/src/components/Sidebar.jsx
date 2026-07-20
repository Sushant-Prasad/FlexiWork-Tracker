import { NavLink, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../constants/navigation.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ChevronRight, LogOut } from "lucide-react";

/*
==================================================
APPLICATION SIDEBAR
--------------------------------------------------
Component:
Sidebar

Purpose:
Provides the primary navigation menu for
authenticated users. Displays user
information, role-based navigation links,
and logout functionality.

Used In:
Main Dashboard Layout

Dependencies:
- React Router
- AuthContext
- Navigation Constants
- Lucide React Icons

Data Source:
- AuthContext
- NAV_ITEMS

Supported Roles:
- EMPLOYEE
- MANAGER
- SYSTEM_ADMIN

Features:
- Role-Based Navigation
- Active Route Highlighting
- User Profile Summary
- Logout Action
- Responsive Desktop Sidebar
- Automatic Navigation Rendering

Business Value:
Provides a centralized navigation system
that adapts to each user's role, ensuring
users only access modules relevant to
their responsibilities.

Workflow:
1. Retrieve authenticated user.
2. Determine user role.
3. Load role-specific navigation menu.
4. Highlight active route.
5. Allow navigation between modules.
6. Logout securely.

Returns:
Desktop sidebar navigation.
==================================================
*/

const Sidebar = () => {

  /*
  ==========================================
  AUTHENTICATION CONTEXT
  ------------------------------------------
  Retrieves the authenticated user and
  logout function from AuthContext.

  user:
  Currently logged-in user.

  logout:
  Clears authentication state.
  ==========================================
  */
  const { user, logout } = useAuth();

  /*
  ==========================================
  NAVIGATION
  ------------------------------------------
  React Router hook used for programmatic
  navigation after logout.
  ==========================================
  */
  const navigate = useNavigate();

  /*
  ==========================================
  USER ROLE
  ------------------------------------------
  Determines which navigation menu should
  be displayed.

  Default:
  EMPLOYEE
  ==========================================
  */
  const role = user?.role || "EMPLOYEE";

  /*
  ==========================================
  ROLE-BASED NAVIGATION
  ------------------------------------------
  Retrieves navigation items according
  to the authenticated user's role.

  Business Logic:
  Implements Role-Based Access Control
  (RBAC) at the navigation level.
  ==========================================
  */
  const links = NAV_ITEMS[role] || [];

  return (

    /*
    ==========================================
    SIDEBAR CONTAINER
    ------------------------------------------
    Fixed desktop sidebar containing:
    • User Information
    • Navigation Menu
    • Logout Button
    ==========================================
    */
    <aside
      className="
      hidden
      lg:flex
      w-72
      h-full
      flex-col
      border-r
      border-slate-200
      bg-white
      shadow-sm
      "
    >

      {/* ======================================
          USER PROFILE SECTION
          --------------------------------------
          Displays authenticated user's
          avatar, name and role.
      ====================================== */}
      <div className="border-b border-slate-200 p-6">

        <div className="flex items-center gap-3">

          {/* User Avatar */}
          <div
            className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-blue-100
            text-lg
            font-bold
            text-blue-700
          "
          >
            {user?.name?.charAt(0) || "U"}
          </div>

          {/* User Information */}
          <div>

            <h3 className="font-semibold text-slate-900">
              {user?.name}
            </h3>

            <p className="text-sm text-slate-500">
              {role.replace("_", " ")}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================
          NAVIGATION SECTION
          --------------------------------------
          Displays role-specific navigation
          links defined in NAV_ITEMS.
      ====================================== */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* Navigation Title */}
        <p
          className="
          mb-4
          px-3
          text-xs
          font-semibold
          uppercase
          tracking-widest
          text-slate-400
        "
        >
          Navigation
        </p>

        <nav className="space-y-2">

          {links.map((link) => {

            /*
            ------------------------------------
            Dynamically render icon assigned
            to the current navigation item.
            ------------------------------------
            */
            const Icon = link.icon;

            return (

              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `
                  group
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  px-4
                  py-3
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-blue-50
                        text-blue-700
                        border
                        border-blue-100
                        shadow-sm
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-slate-900
                      `
                  }
                `
                }
              >

                {({ isActive }) => (

                  <>

                    {/* Navigation Label */}
                    <div className="flex items-center gap-3">

                      {/* Navigation Icon */}
                      {Icon && (
                        <Icon
                          size={20}
                          className={
                            isActive
                              ? "text-blue-600"
                              : "text-slate-500"
                          }
                        />
                      )}

                      {/* Navigation Text */}
                      <span className="font-medium">
                        {link.label}
                      </span>

                    </div>

                    {/* Active Indicator */}
                    <ChevronRight
                      size={16}
                      className={`
                        transition-transform
                        ${
                          isActive
                            ? "translate-x-1 text-blue-600"
                            : "text-slate-400"
                        }
                      `}
                    />

                  </>

                )}

              </NavLink>

            );

          })}

        </nav>

      </div>

      {/* ======================================
          SIDEBAR FOOTER
          --------------------------------------
          Provides logout functionality.

          Business Logic:
          1. Clear authentication data.
          2. Redirect user to Login page.
      ====================================== */}
      <div className="border-t border-slate-200 p-4">

        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#245BA7] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#111c31]"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;