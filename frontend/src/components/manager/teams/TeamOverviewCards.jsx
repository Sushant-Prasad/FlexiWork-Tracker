/*
==================================================
TEAM OVERVIEW CARDS COMPONENT
--------------------------------------------------
Components:
- TeamOverviewCards
- StatCard

Purpose:
Displays key workforce and attendance
metrics for the selected team.

Used In:
Manager Teams Dashboard

Related API:
GET /api/teams/:id/overview

Metrics Displayed:
- Total Members
- Office Today
- Remote Today
- Unlogged Employees

Business Value:
Provides managers with a high-level view
of team activity, attendance compliance,
and workforce distribution.

Workflow:
1. Receive overview analytics
2. Extract KPI metrics
3. Render overview cards
4. Display workforce summary

Return:
Team overview KPI dashboard section.
==================================================
*/

import { Users, MapPin, LogIn, AlertCircle } from "lucide-react";

/*
==================================================
STAT CARD COMPONENT
--------------------------------------------------
Component:
StatCard

Props:
- icon
- label
- value

Purpose:
Reusable KPI card used for displaying
individual workforce metrics.

Features:
- Icon visualization
- KPI value display
- Responsive design
- Consistent styling

Business Logic:
Creates a unified design pattern for all
overview metrics across dashboards.

Return:
Single KPI card.
==================================================
*/
const StatCard = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="rounded-lg p-6 bg-prime border border-primary/20 text-white hover:shadow transition">

    {/* ======================================
        CARD CONTENT
    ====================================== */}
    <div className="flex items-center justify-between">

      {/* KPI DETAILS */}
      <div>

        {/* KPI LABEL */}
        <p className="text-sm text-white/80 font-medium">
          {label}
        </p>

        {/* KPI VALUE */}
        <p className="text-3xl font-bold text-white mt-2">
          {value}
        </p>

      </div>

      {/* KPI ICON */}
      <div className="p-3 rounded-full bg-prime-80">

        <Icon
          size={24}
          className="text-white"
        />

      </div>

    </div>

  </div>
);

/*
==================================================
TEAM OVERVIEW CARDS
--------------------------------------------------
Component:
TeamOverviewCards

Props:
- overview
- isLoading

Purpose:
Displays workforce summary metrics for
the selected team.

Metrics:
- Total Members
- Employees Working From Office
- Employees Working Remotely
- Employees With Missing Work Logs

Business Value:
Provides managers with an instant view
of team attendance, workforce allocation,
and compliance status.

Return:
Grid of overview KPI cards.
==================================================
*/
const TeamOverviewCards = ({
  overview,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton KPI cards while
  overview analytics are loading.

  Business Logic:
  Improves perceived performance and
  prevents layout shifts.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="glass-card rounded-lg p-6 border border-white/10 animate-pulse"
          >

            {/* KPI Label Skeleton */}
            <div className="h-4 bg-white/10 rounded w-1/3 mb-3"></div>

            {/* KPI Value Skeleton */}
            <div className="h-8 bg-white/20 rounded w-1/2"></div>

          </div>
        ))}

      </div>
    );
  }

  /*
  ==========================================
  OVERVIEW DASHBOARD
  ------------------------------------------
  Purpose:
  Displays key workforce KPIs.

  KPI Categories:
  - Team Size
  - Office Presence
  - Remote Workforce
  - Attendance Compliance

  Business Value:
  Enables managers to quickly assess
  operational health and workforce
  distribution.
  ==========================================
  */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      {/* ======================================
          TOTAL MEMBERS
          --------------------------------------
          Total workforce assigned to the team.
      ====================================== */}
      <StatCard
        icon={Users}
        label="Total Members"
        value={overview?.memberCount || 0}
      />

      {/* ======================================
          OFFICE TODAY
          --------------------------------------
          Employees currently working
          from office today.
      ====================================== */}
      <StatCard
        icon={MapPin}
        label="Office Today"
        value={overview?.officeToday || 0}
      />

      {/* ======================================
          REMOTE TODAY
          --------------------------------------
          Employees currently working
          remotely today.
      ====================================== */}
      <StatCard
        icon={LogIn}
        label="Remote Today"
        value={overview?.remoteToday || 0}
      />

      {/* ======================================
          UNLOGGED EMPLOYEES
          --------------------------------------
          Employees who have not submitted
          today's work log.

          Business Impact:
          Indicates attendance compliance
          issues requiring manager review.
      ====================================== */}
      <StatCard
        icon={AlertCircle}
        label="Unlogged"
        value={overview?.unlogged || 0}
      />

    </div>
  );
};

export default TeamOverviewCards;