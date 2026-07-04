import { Mail, Crown } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
MANAGER CARD COMPONENT
--------------------------------------------------
Component:
ManagerCard

Props:
- manager
- isLoading

Purpose:
Displays detailed information about the
employee's reporting manager in a
prominent hero card.

Used In:
Employee Team Members Page

Data Source:
GET /api/users/team
or
GET /api/teams/my-team

Features:
- Manager Avatar
- Manager Name
- Manager Badge
- Email Link
- Timezone Information
- Loading State
- Empty State

Business Value:
Provides employees with quick access to
their reporting manager's information,
making communication and collaboration
more efficient.

Workflow:
1. Parent fetches team information.
2. Manager object is passed as props.
3. Loading skeleton is displayed while
   data is being fetched.
4. Empty state is shown if no manager
   exists.
5. Manager information is rendered.

Return:
Manager profile summary card.
==================================================
*/

/*
==================================================
GET USER INITIALS
--------------------------------------------------
Purpose:
Generates initials from the manager's
full name for the avatar placeholder.

Parameters:
- name: string

Return:
Two-character uppercase initials.

Example:
"Sushant Prasad"
Returns:
"SP"
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
MANAGER CARD
--------------------------------------------------
Component:
ManagerCard

Props:
- manager
- isLoading

Purpose:
Displays the reporting manager's profile
with avatar, contact information, and
role details.

Return:
Responsive manager information card.
==================================================
*/
const ManagerCard = ({
  manager,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays a skeleton placeholder while
  manager information is being loaded.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="h-36 animate-pulse rounded-3xl bg-muted" />
    );
  }

  /*
  ==========================================
  EMPTY STATE
  ------------------------------------------
  Purpose:
  Displays a friendly message when no
  manager has been assigned to the
  employee's team.
  ==========================================
  */
  if (!manager) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 py-10">

        <p className="text-sm text-muted-foreground">
          No manager assigned to this team.
        </p>

      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">

      {/* ======================================
          MANAGER AVATAR
          --------------------------------------
          Displays the manager's profile image.
          Falls back to generated initials if
          no avatar is available.
      ====================================== */}
      <div className="relative shrink-0">

        {manager.avatarUrl ? (

          <img
            src={manager.avatarUrl}
            alt={manager.name}
            className="h-16 w-16 rounded-2xl object-cover"
          />

        ) : (

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white">

            {getInitials(manager.name)}

          </div>

        )}

        {/* ==================================
            MANAGER BADGE
            ----------------------------------
            Highlights this user as the team
            manager.
        ================================== */}
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">

          <Crown
            size={12}
            className="text-white"
          />

        </div>

      </div>

      {/* ======================================
          MANAGER INFORMATION
          --------------------------------------
          Displays manager's basic profile
          information.
      ====================================== */}
      <div className="flex-1 min-w-0">

        {/* ==============================
            NAME & ROLE
        ============================== */}
        <div className="flex flex-wrap items-center gap-2">

          <h3 className="text-lg font-semibold text-foreground">

            {manager.name}

          </h3>

          <Badge
            variant="default"
            className="text-[10px]"
          >
            Manager
          </Badge>

        </div>

        {/* ==============================
            EMAIL ADDRESS
            ------------------------------
            Clicking opens the user's
            default email client.
        ============================== */}
        <a
          href={`mailto:${manager.email}`}
          className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
        >

          <Mail size={13} />

          {manager.email}

        </a>

        {/* ==============================
            TIMEZONE
            ------------------------------
            Displays the manager's preferred
            timezone if available.
        ============================== */}
        {manager.timezone && (
          <p className="mt-1 text-xs text-muted-foreground">

            Timezone: {manager.timezone}

          </p>
        )}

      </div>

    </div>
  );
};

export default ManagerCard;