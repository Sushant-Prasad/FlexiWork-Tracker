import { Camera } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
PROFILE HEADER
--------------------------------------------------
Purpose:
  Large hero card at top of profile page showing
  avatar, name, role badge, email, and join date.

Props:
  - user: profile object from GET /api/users/me
  - isLoading: boolean
==================================================
*/

const ROLE_BADGE = {
  EMPLOYEE: { label: "Employee", variant: "secondary" },
  MANAGER: { label: "Manager", variant: "default" },
  SYSTEM_ADMIN: { label: "System Admin", variant: "destructive" },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatJoinDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ProfileHeader = ({ user, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-52 animate-pulse rounded-3xl bg-primary/60" />
    );
  }

  const roleCfg = ROLE_BADGE[user?.role] || ROLE_BADGE.EMPLOYEE;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-10 shadow-[0_8px_32px_rgba(15,23,42,0.15)]">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/20"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 ring-4 ring-white/20 text-2xl font-bold text-white">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Camera size={13} className="text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white truncate">
              {user?.name || "—"}
            </h1>
            <Badge variant={roleCfg.variant} className="shrink-0">
              {roleCfg.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-white/75">{user?.email}</p>
          <p className="mt-1 text-xs text-white/55">
            Member since {formatJoinDate(user?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
