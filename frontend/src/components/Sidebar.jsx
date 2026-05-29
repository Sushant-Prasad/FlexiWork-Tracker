import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../constants/navigation.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ChevronRight } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();

  const role = user?.role || "EMPLOYEE";

  const links = NAV_ITEMS[role] || [];

  return (
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
      {/* User Section */}
      <div className="border-b border-slate-200 p-6">

        <div className="flex items-center gap-3">

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

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">

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
                    <div className="flex items-center gap-3">

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

                      <span className="font-medium">
                        {link.label}
                      </span>

                    </div>

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

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">

        <div
          className="
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-blue-500
          p-4
          text-white
        "
        >
          <p className="text-sm font-medium">
            FlexiWork Tracker
          </p>

          <p className="mt-1 text-xs text-blue-100">
            Smart Hybrid Workforce Management
          </p>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;