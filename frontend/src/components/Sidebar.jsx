import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../constants/navigation.js";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";
  const links = NAV_ITEMS[role] || [];

  return (
    <aside className="hidden w-64 border-r border-zinc-800 bg-zinc-950 lg:block">
      <div className="px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {role.replace("_", " ")}
        </p>
      </div>
      <nav className="flex flex-col gap-1 px-4 pb-6">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-zinc-300 hover:bg-zinc-900"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
