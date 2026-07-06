import { Users, Crown, Building2, Wifi } from "lucide-react";

/*
==================================================
TEAM OVERVIEW CARDS COMPONENT
--------------------------------------------------
Component:
TeamOverviewCards

Props:
- members
- isLoading

Purpose:
Displays high-level statistics about the
current team in a responsive KPI card layout.

Used In:
Employee Team Members Page

Data Source:
GET /api/users/team

Metrics Displayed:
- Total Members
- Managers
- Employees
- System Admins

Features:
- Responsive KPI Cards
- Loading Skeleton
- Dynamic Statistics
- Role-based Summary

Business Value:
Provides employees with a quick overview
of the team's composition, helping them
understand the organizational structure
and distribution of roles.

Workflow:
1. Receive team member list.
2. Show loading placeholders while data
   is being fetched.
3. Calculate role-based statistics.
4. Render KPI cards dynamically.

Return:
Responsive team overview dashboard.
==================================================
*/

const TeamOverviewCards = ({
  members,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays animated skeleton cards while
  team information is being loaded.

  Business Logic:
  Prevents layout shifts and improves the
  user experience during API requests.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-3xl bg-muted"
          />
        ))}

      </div>
    );
  }

  /*
  ==========================================
  TEAM STATISTICS
  ------------------------------------------
  Purpose:
  Computes summary statistics from the
  available team member list.

  Metrics:
  - Total Members
  - Managers
  - Employees
  - System Admins

  Business Logic:
  Statistics are calculated locally,
  eliminating the need for additional
  API requests.
  ==========================================
  */
  const total = members.length;

  const managers = members.filter(
    (member) => member.role === "MANAGER"
  ).length;

  const employees = members.filter(
    (member) => member.role === "EMPLOYEE"
  ).length;

  const admins = members.filter(
    (member) => member.role === "SYSTEM_ADMIN"
  ).length;

  /*
  ==========================================
  KPI CONFIGURATION
  ------------------------------------------
  Purpose:
  Centralizes all KPI card information.

  Business Logic:
  Makes it easy to add, remove, or modify
  statistics without changing the UI
  rendering logic.
  ==========================================
  */
  const CARDS = [
    {
      label: "Total Members",
      value: total,
      icon: Users,
    },
    {
      label: "Managers",
      value: managers,
      icon: Crown,
    },
    {
      label: "Employees",
      value: employees,
      icon: Building2,
    },
    {
      label: "Admins",
      value: admins,
      icon: Wifi,
    },
  ];

  return (

    /*
    ==========================================
    KPI CARD GRID
    ------------------------------------------
    Layout:
    Mobile  : 1 Column
    Tablet  : 2 Columns
    Desktop : 4 Columns

    Purpose:
    Displays all team statistics in a
    responsive dashboard.
    ==========================================
    */
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {CARDS.map(({
        label,
        value,
        icon: Icon,
      }) => (

        <div
          key={label}
          className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
        >

          {/* ==================================
              CARD CONTENT
          ================================== */}
          <div className="flex items-start justify-between">

            {/* ==============================
                KPI INFORMATION
            ============================== */}
            <div>

              {/* Metric Label */}
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">

                {label}

              </p>

              {/* Metric Value */}
              <p className="mt-3 text-4xl font-bold text-white">

                {value}

              </p>

            </div>

            {/* ==============================
                KPI ICON
            ============================== */}
            <div className="rounded-2xl bg-white/15 p-3">

              <Icon
                size={22}
                className="text-white"
              />

            </div>

          </div>

        </div>

      ))}

    </div>
  );
};

export default TeamOverviewCards;