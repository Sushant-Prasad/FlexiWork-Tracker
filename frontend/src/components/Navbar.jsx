import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleDefaultPath } from "../constants/navigation.js";

/*
==================================================
COMMON NAVBAR
--------------------------------------------------
This navbar is shared across:
- Employee
- Manager
- System Admin

Only sidebar/routes change by role.
==================================================
*/

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = getRoleDefaultPath(user?.role);
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
      
      <div className="flex items-center justify-between px-6 py-4">

        {/* ======================================
            LEFT SECTION
        ====================================== */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu Button */}
          <button
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="rounded-lg border border-zinc-800 p-2 text-zinc-300 transition hover:bg-zinc-900 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              F
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">
                FlexiWork Tracker
              </h1>

              <p className="text-xs text-zinc-400">
                Hybrid Workforce Platform
              </p>
            </div>
          </Link>

        </div>

        {/* ======================================
            CENTER SECTION
        ====================================== */}
        
        {/* ======================================
            RIGHT SECTION
        ====================================== */}
        <div className="flex items-center gap-4">

          {!isAuthenticated ? (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="rounded-xl border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* Notification */}
              <button className="relative rounded-xl border border-zinc-800 p-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white">

                <Bell size={20} />

                {/* Notification Badge */}
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>

              </button>

              {/* ======================================
                  PROFILE DROPDOWN
              ====================================== */}
              <div className="relative">

                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 px-3 py-2 transition hover:bg-zinc-900"
                >

                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {user?.name?.charAt(0) || "U"}
                  </div>

                  {/* User Info */}
                  <div className="hidden text-left sm:block">

                    <p className="text-sm font-medium text-white">
                      {user?.name}
                    </p>

                    <p className="text-xs text-zinc-400">
                      {user?.role}
                    </p>

                  </div>

                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl"
                    >

                      {/* Profile Header */}
                      <div className="border-b border-zinc-800 px-5 py-4">

                        <p className="font-medium text-white">
                          {user?.name}
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {user?.email}
                        </p>

                      </div>

                      {/* Menu Items */}
                      <div className="p-2">

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                        >
                          <User size={18} />
                          My Profile
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                        >
                          <Settings size={18} />
                          Settings
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            navigate("/login");
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>

                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </>
          )}

        </div>
      </div>

      {/* ======================================
          MOBILE NAVIGATION
      ====================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="border-t border-zinc-800 bg-zinc-950 lg:hidden"
          >

            <div className="flex flex-col gap-2 px-6 py-5">

              <NavLink
                to={dashboardPath}
                className="rounded-xl px-4 py-3 text-zinc-300 transition hover:bg-zinc-900"
              >
                Dashboard
              </NavLink>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Navbar;