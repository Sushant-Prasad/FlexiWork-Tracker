import { Mail, Crown, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
TEAM MEMBER CARD COMPONENT
--------------------------------------------------
Component:
TeamMemberCard

Props:
- member

Purpose:
Displays detailed information for a
single team member in a reusable card.

Used In:
Employee Team Members Page
Manager Teams Page

Parent Component:
TeamMembersGrid

Data Source:
GET /api/users/team
or
GET /api/teams/my-team

Features:
- User Avatar
- Initials Fallback
- Role Badge
- Email Link
- Timezone
- Manager Crown
- Hover Animation

Business Value:
Provides a clean and professional way to
display team member information, making
it easy for employees and managers to
identify teammates and their roles.

Workflow:
1. Parent fetches team members.
2. Member object is passed as props.
3. Avatar or initials are displayed.
4. Role badge is rendered.
5. Contact information is shown.
6. Optional timezone is displayed.

Return:
Responsive team member profile card.
==================================================
*/

/*
==================================================
ROLE BADGE CONFIGURATION
--------------------------------------------------
Purpose:
Maps each system role to its display
label, badge variant, and optional icon.

Roles:
- EMPLOYEE
- MANAGER
- SYSTEM_ADMIN

Business Logic:
Keeps role presentation centralized
and easy to maintain.
==================================================
*/
const ROLE_BADGE = {
  MANAGER: {
    label: "Manager",
    variant: "default",
    icon: Crown,
  },
  SYSTEM_ADMIN: {
    label: "Admin",
    variant: "destructive",
    icon: ShieldCheck,
  },
  EMPLOYEE: {
    label: "Employee",
    variant: "secondary",
    icon: null,
  },
};

/*
==================================================
ROLE COLOR CONFIGURATION
--------------------------------------------------
Purpose:
Defines avatar background colors for
different user roles.

Business Logic:
Provides visual distinction between
employees, managers, and administrators.
==================================================
*/
const ROLE_COLORS = {
  MANAGER: "bg-primary text-white",
  SYSTEM_ADMIN: "bg-destructive text-white",
  EMPLOYEE: "bg-secondary text-secondary-foreground",
};

/*
==================================================
GET USER INITIALS
--------------------------------------------------
Purpose:
Generates initials when a profile image
is unavailable.

Parameters:
- name: string

Return:
Two-character uppercase initials.

Example:
"John Doe" -> "JD"
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
TEAM MEMBER CARD
--------------------------------------------------
Component:
TeamMemberCard

Props:
- member

Purpose:
Displays an individual team member's
profile information.

Return:
Responsive profile card.
==================================================
*/
const TeamMemberCard = ({ member }) => {

  /*
  ==========================================
  ROLE CONFIGURATION
  ------------------------------------------
  Purpose:
  Retrieves badge configuration and
  avatar color based on the member's
  assigned role.
  ==========================================
  */
  const roleCfg =
    ROLE_BADGE[member.role] ||
    ROLE_BADGE.EMPLOYEE;

  const RoleIcon = roleCfg.icon;

  const avatarColorClass =
    ROLE_COLORS[member.role] ||
    ROLE_COLORS.EMPLOYEE;

  return (
    <div className="group flex flex-col rounded-3xl border border-border bg-card p-5 shadow-[0_4px_14px_rgba(15,23,42,0.06)] transition hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)] hover:-translate-y-0.5">

      {/* ======================================
          CARD HEADER
          --------------------------------------
          Displays user avatar and role badge.
      ====================================== */}
      <div className="flex items-start justify-between">

        {/* ==================================
            USER AVATAR
            ----------------------------------
            Displays profile image or
            generated initials.
        ================================== */}
        <div className="relative">

          {member.avatarUrl ? (

            <img
              src={member.avatarUrl}
              alt={member.name}
              className="h-12 w-12 rounded-2xl object-cover"
            />

          ) : (

            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${avatarColorClass}`}
            >

              {getInitials(member.name)}

            </div>

          )}

          {/* ==============================
              MANAGER INDICATOR
              ------------------------------
              Displays a crown icon when
              the member is the team
              manager.
          ============================== */}
          {member.role === "MANAGER" && (
            <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow">

              <Crown
                size={10}
                className="text-white"
              />

            </div>
          )}

        </div>

        {/* ==============================
            ROLE BADGE
            ------------------------------
            Displays member's system role.
        ============================== */}
        <Badge
          variant={roleCfg.variant}
          className="gap-1 text-[10px]"
        >

          {RoleIcon && (
            <RoleIcon size={10} />
          )}

          {roleCfg.label}

        </Badge>

      </div>

      {/* ======================================
          MEMBER INFORMATION
          --------------------------------------
          Displays member name and email.
      ====================================== */}
      <div className="mt-4 flex-1">

        {/* Member Name */}
        <h3 className="text-sm font-semibold leading-tight text-foreground">

          {member.name}

        </h3>

        {/* Email Address */}
        <a
          href={`mailto:${member.email}`}
          className="mt-1 flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
        >

          <Mail size={11} />

          <span className="truncate">

            {member.email}

          </span>

        </a>

      </div>

      {/* ======================================
          TIMEZONE INFORMATION
          --------------------------------------
          Displays the member's preferred
          timezone when available.
      ====================================== */}
      {member.timezone && (

        <div className="mt-4 border-t border-border pt-3">

          <p className="text-[11px] text-muted-foreground">

            {member.timezone}

          </p>

        </div>

      )}

    </div>
  );
};

export default TeamMemberCard;