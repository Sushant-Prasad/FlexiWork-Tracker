/*
==================================================
ACCOUNT INFORMATION CARD
--------------------------------------------------
Component:
AccountInfoCard

Sub Components:
- ReadOnlyRow

Helpers:
- formatDate()

Purpose:
Displays system-controlled account information
that cannot be modified by the user.

Used In:
Employee Profile Page
Manager Profile Page
Admin Profile Page

Related API:
GET /api/users/me

Information Displayed:
- Email Address
- User Role
- User ID
- Account Creation Date

Business Value:
Provides users with visibility into
their account identity and access level
without allowing modifications to
security-sensitive fields.

Workflow:
1. Receive user profile data
2. Format account information
3. Display read-only details
4. Show role-based badge styling

Return:
Read-only account information section.
==================================================
*/

import { Mail, ShieldCheck, Hash, Calendar } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
ROLE BADGE CONFIGURATION
--------------------------------------------------
Purpose:
Maps system roles to display labels
and badge variants.

Supported Roles:
- EMPLOYEE
- MANAGER
- SYSTEM_ADMIN

Business Logic:
Provides consistent role visualization
throughout the application.
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
DATE FORMATTER
--------------------------------------------------
Function:
formatDate()

Parameters:
- str

Purpose:
Converts ISO date strings into a
user-friendly display format.

Example:
2026-06-19T08:30:00Z
→
19 June 2026

Fallback:
Returns "—" when date is unavailable.

Return:
Formatted date string.
==================================================
*/
const formatDate = (str) => {
  if (!str) return "—";

  return new Date(str).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/*
==================================================
READ ONLY ROW COMPONENT
--------------------------------------------------
Component:
ReadOnlyRow

Props:
- icon
- label
- value
- children

Purpose:
Reusable row component for displaying
read-only account information.

Features:
- Icon Support
- Label Display
- Custom Content Rendering
- Consistent Layout

Business Logic:
Standardizes account information display
across all profile sections.

Return:
Single account information row.
==================================================
*/
const ReadOnlyRow = ({
  icon: Icon,
  label,
  value,
  children,
}) => (
  <div className="flex items-start justify-between gap-4 py-3.5 border-b border-border last:border-0">

    {/* ======================================
        LABEL SECTION
    ====================================== */}
    <div className="flex items-center gap-2.5 shrink-0">

      {/* Field Icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-primary">

        <Icon size={14} />

      </div>

      {/* Field Label */}
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">

        {label}

      </span>

    </div>

    {/* ======================================
        VALUE SECTION
    ====================================== */}
    {children || (
      <span className="text-sm font-medium text-foreground text-right break-all">

        {value}

      </span>
    )}

  </div>
);

/*
==================================================
ACCOUNT INFO CARD
--------------------------------------------------
Component:
AccountInfoCard

Props:
- user
- isLoading

Purpose:
Displays account-related information that
is managed by the system and cannot be
edited by users.

Features:
- Account Identity
- Access Role
- Unique User ID
- Registration Date

Business Value:
Provides transparency regarding account
ownership and permissions while preserving
system integrity.

Return:
Account information card.
==================================================
*/
const AccountInfoCard = ({
  user,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  account information is loading.

  Business Logic:
  Prevents layout shifts and improves
  perceived performance.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="space-y-3">

        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-2xl bg-muted"
          />
        ))}

      </div>
    );
  }

  /*
  ==========================================
  ROLE CONFIGURATION
  ------------------------------------------
  Purpose:
  Resolves role-specific badge styling.

  Fallback:
  Defaults to EMPLOYEE role when role
  information is unavailable.
  ==========================================
  */
  const roleCfg =
    ROLE_BADGE[user?.role] ||
    ROLE_BADGE.EMPLOYEE;

  /*
  ==========================================
  ACCOUNT INFORMATION DISPLAY
  ------------------------------------------
  Purpose:
  Displays system-managed user details.

  Fields:
  - Email
  - Role
  - User ID
  - Member Since

  Business Value:
  Gives users visibility into their
  account metadata and access privileges.
  ==========================================
  */
  return (
    <div className="divide-y divide-border">

      {/* ======================================
          EMAIL ADDRESS
      ====================================== */}
      <ReadOnlyRow
        icon={Mail}
        label="Email"
        value={user?.email}
      />

      {/* ======================================
          USER ROLE
      ====================================== */}
      <ReadOnlyRow
        icon={ShieldCheck}
        label="Role"
      >

        <Badge variant={roleCfg.variant}>
          {roleCfg.label}
        </Badge>

      </ReadOnlyRow>

      {/* ======================================
          USER IDENTIFIER
      ====================================== */}
      <ReadOnlyRow
        icon={Hash}
        label="User ID"
      >

        <span className="rounded-xl bg-secondary px-3 py-1 font-mono text-[11px] text-secondary-foreground">

          {user?._id || "—"}

        </span>

      </ReadOnlyRow>

      {/* ======================================
          ACCOUNT CREATION DATE
      ====================================== */}
      <ReadOnlyRow
        icon={Calendar}
        label="Member Since"
        value={formatDate(user?.createdAt)}
      />

    </div>
  );
};

export default AccountInfoCard;