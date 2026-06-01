import { useEffect, useRef, useState } from "react";
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
import {
  getRoleDefaultPath,
  getRoleProfilePath,
} from "../constants/navigation.js";

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

  const profileRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = getRoleDefaultPath(user?.role);
  const profilePath = getRoleProfilePath(user?.role);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      
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
            className="rounded-lg border border-border p-2 text-foreground transition hover:bg-muted lg:hidden"
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
              F
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">
                FlexiWork Tracker
              </h1>

              <p className="text-xs text-muted-foreground">
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
                className="rounded-xl border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              

              {/* ======================================
                  PROFILE DROPDOWN
              ====================================== */}
              <div className="relative" ref={profileRef}>

                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="flex items-center gap-3 rounded-xl border border-border px-3 py-2 transition hover:bg-muted"
                >

                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </div>

                  {/* User Info */}
                  <div className="hidden text-left sm:block">

                    <p className="text-sm font-medium text-foreground">
                      {user?.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
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
                      className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                    >

                      {/* Profile Header */}
                      <div className="border-b border-border px-5 py-4">

                        <p className="font-medium text-foreground">
                          {user?.name}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {user?.email}
                        </p>

                      </div>

                      {/* Menu Items */}
                      <div className="p-2">

                        <Link
                          to={profilePath}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-foreground transition hover:bg-muted"
                        >
                          <User size={18} />
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                            navigate("/login");
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-destructive transition hover:bg-destructive/10"
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
            className="border-t border-border bg-background lg:hidden"
          >

            <div className="flex flex-col gap-2 px-6 py-5">

              <NavLink
                to={dashboardPath}
                className="rounded-xl px-4 py-3 text-foreground transition hover:bg-muted"
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