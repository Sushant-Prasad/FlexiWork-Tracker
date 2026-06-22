/*
==================================================
PROFILE HEADER COMPONENT
--------------------------------------------------
Component:
ProfileHeader

Helpers:
- getInitials()
- formatJoinDate()

Purpose:
Displays the user's profile summary in a
hero-style header section.

Used In:
Employee Profile Page
Manager Profile Page
Admin Profile Page

Related API:
GET /api/users/me

Features:
- Profile Avatar
- User Initials Fallback
- User Name
- Role Badge
- Email Address
- Join Date
- Professional Hero Layout

Business Value:
Provides a quick identity overview and
personalized experience when users
access their profile page.

Workflow:
1. Load profile information
2. Display loading skeleton if needed
3. Render avatar or initials
4. Show role badge
5. Display account information

Return:
Profile hero section.
==================================================
*/

import { Camera } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
ROLE BADGE CONFIGURATION
--------------------------------------------------
Purpose:
Maps user roles to display labels
and badge variants.

Supported Roles:
- EMPLOYEE
- MANAGER
- SYSTEM_ADMIN

Business Logic:
Ensures role presentation remains
consistent throughout the application.
==================================================
*/
const ROLE_BADGE = {
  EMPLOYEE: {
    label: "Employee",
    variant: "secondary",
  },

  MANAGER: {
    label: "Manager",
    variant: "default",
  },

  SYSTEM_ADMIN: {
    label: "System Admin",
    variant: "destructive",
  },
};

/*
==================================================
INITIALS GENERATOR
--------------------------------------------------
Function:
getInitials()

Parameters:
- name

Purpose:
Creates user initials from full name.

Examples:
"Sushant Prasad" → "SP"
"John Doe" → "JD"

Business Logic:
Used as a fallback when profile image
is unavailable.

Return:
String (maximum 2 characters)
==================================================
*/
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/*
==================================================
JOIN DATE FORMATTER
--------------------------------------------------
Function:
formatJoinDate()

Parameters:
- dateStr

Purpose:
Formats account creation date into a
user-friendly display format.

Example:
2026-06-22T10:00:00Z
→
22 June 2026

Fallback:
Returns "—" when unavailable.

Return:
Formatted date string.
==================================================
*/
const formatJoinDate = (dateStr) => {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

/*
==================================================
PROFILE HEADER
--------------------------------------------------
Component:
ProfileHeader

Props:
- user
- isLoading

Purpose:
Displays a visual summary of the
currently authenticated user.

Sections:
- Avatar
- Name
- Role Badge
- Email
- Join Date

Business Value:
Acts as the primary identity card for
the user profile page and creates a
professional employee portal experience.

Return:
Profile hero section.
==================================================
*/
const ProfileHeader = ({
  user,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays a skeleton placeholder while
  profile data is loading.

  Business Logic:
  Prevents layout shifts and improves
  perceived performance.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="h-52 animate-pulse rounded-3xl bg-primary/60" />
    );
  }

  /*
  ==========================================
  ROLE CONFIGURATION
  ------------------------------------------
  Purpose:
  Resolves role badge configuration
  based on current user's role.

  Fallback:
  EMPLOYEE
  ==========================================
  */
  const roleCfg =
    ROLE_BADGE[user?.role] ||
    ROLE_BADGE.EMPLOYEE;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-10 shadow-[0_8px_32px_rgba(15,23,42,0.15)]">

      {/* ======================================
          DECORATIVE BACKGROUND ELEMENTS
          --------------------------------------
          Adds depth and visual appeal to
          the hero section.
      ====================================== */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />

      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5" />

      {/* ======================================
          MAIN CONTENT
      ====================================== */}
      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">

        {/* ==================================
            PROFILE AVATAR
        ================================== */}
        <div className="relative shrink-0">

          {user?.avatarUrl ? (

            /*
            ==============================
            USER PROFILE IMAGE
            ==============================
            */
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/20"
            />

          ) : (

            /*
            ==============================
            INITIALS FALLBACK AVATAR
            ==============================
            */
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 ring-4 ring-white/20 text-2xl font-bold text-white">

              {getInitials(user?.name)}

            </div>

          )}

          {/* ==================================
              CAMERA BADGE
              ----------------------------------
              Indicates profile picture area.
              Future enhancement:
              Avatar upload functionality.
          ================================== */}
          <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">

            <Camera
              size={13}
              className="text-white"
            />

          </div>

        </div>

        {/* ==================================
            USER INFORMATION
        ================================== */}
        <div className="flex-1 min-w-0">

          {/* ==============================
              NAME + ROLE
          ============================== */}
          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-bold text-white truncate">

              {user?.name || "—"}

            </h1>

            <Badge
              variant={roleCfg.variant}
              className="shrink-0"
            >
              {roleCfg.label}
            </Badge>

          </div>

          {/* ==============================
              EMAIL ADDRESS
          ============================== */}
          <p className="mt-1 text-sm text-white/75">

            {user?.email}

          </p>

          {/* ==============================
              MEMBER SINCE
          ============================== */}
          <p className="mt-1 text-xs text-white/55">

            Member since{" "}
            {formatJoinDate(user?.createdAt)}

          </p>

        </div>

      </div>

    </div>
  );
};

export default ProfileHeader;