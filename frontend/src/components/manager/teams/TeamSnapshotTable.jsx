/*
==================================================
TEAM SNAPSHOT TABLE COMPONENT
--------------------------------------------------
Component:
TeamSnapshotTable

Props:
- snapshot
- isLoading

Purpose:
Displays a complete daily workforce snapshot
for the selected team.

Used In:
Manager Teams Dashboard

Related API:
GET /api/teams/:id/daily-snapshot

Features:
- Snapshot Summary
- Attendance Compliance
- Work Mode Comparison
- Employee Work Hours
- Workforce Analytics

Metrics Displayed:
- Total Members
- Matched Attendance
- Attendance Deviations
- Unlogged Employees
- Total Worked Hours

Business Value:
Provides managers with a comprehensive
view of daily workforce activity and
attendance compliance.

Workflow:
1. Receive daily snapshot data
2. Calculate summary metrics
3. Display workforce KPIs
4. Render employee-level details

Return:
Daily workforce analytics dashboard.
==================================================
*/

import dayjs from "dayjs";

/*
==================================================
TEAM SNAPSHOT TABLE
--------------------------------------------------
Component:
TeamSnapshotTable

Purpose:
Visualizes daily attendance and workforce
activity for all members of a team.

Business Value:
Helps managers:
- Monitor attendance compliance
- Compare planned vs actual work modes
- Track worked hours
- Identify workforce anomalies

Return:
Daily snapshot analytics section.
==================================================
*/
const TeamSnapshotTable = ({
  snapshot,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  snapshot analytics are loading.

  Business Logic:
  Prevents layout shifts and improves
  perceived application performance.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 overflow-hidden animate-pulse gradient-bg text-white">

        {/* Header Skeleton */}
        <div className="p-6 border-b border-white/10">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/10 rounded w-full"
            ></div>
          ))}
        </div>

      </div>
    );
  }

  /*
  ==========================================
  SNAPSHOT DATA EXTRACTION
  ------------------------------------------
  Purpose:
  Extracts snapshot metadata and employee
  records from the API response.

  Fallback Strategy:
  Provides safe default values to avoid
  runtime errors.
  ==========================================
  */
  const today =
    snapshot?.date ||
    new Date().toISOString().slice(0, 10);

  const members = snapshot?.members || [];

  /*
  ==========================================
  SNAPSHOT SUMMARY CALCULATIONS
  ------------------------------------------
  Purpose:
  Generates dashboard KPIs from member data.

  Metrics:
  - Total Members
  - Matched Attendance
  - Deviations
  - Unlogged Employees
  - Total Worked Hours

  Business Logic:
  Provides managers with a quick overview
  of daily workforce health.
  ==========================================
  */
  const summary = {
    total: members.length,

    matched: members.filter(
      (member) => member.attendanceStatus === "MATCH"
    ).length,

    deviated: members.filter(
      (member) => member.attendanceStatus === "DEVIATION"
    ).length,

    unlogged: members.filter(
      (member) => member.attendanceStatus === "UNLOGGED"
    ).length,

    totalHours: members.reduce(
      (sum, member) => sum + (member.workedHours || 0),
      0
    ),
  };

  /*
  ==========================================
  SNAPSHOT DASHBOARD
  ------------------------------------------
  Purpose:
  Displays daily workforce analytics.

  Sections:
  1. Header
  2. Summary Metrics
  3. Employee Details

  Business Value:
  Provides actionable workforce insights
  for managers.
  ==========================================
  */
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden gradient-bg text-white mb-8">

      {/* ======================================
          DASHBOARD HEADER
      ====================================== */}
      <div className="p-6 border-b border-white/10">

        <div className="flex items-center justify-between">

          {/* Snapshot Information */}
          <div>

            <h3 className="text-lg font-semibold text-white">
              Daily Snapshot
            </h3>

            <p className="text-xs text-zinc-400 mt-1">
              Generated for{" "}
              {dayjs(today).format("MMMM DD, YYYY")}
            </p>

          </div>

          {/* Team Information */}
          <div className="text-right">

            <p className="text-sm text-zinc-300">
              Team: {snapshot?.teamName}
            </p>

          </div>

        </div>

      </div>

      {/* ======================================
          SUMMARY METRICS
      ====================================== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-white/10">

        {/* Total Members */}
        <div className="text-center">

          <p className="text-xs text-zinc-400 mb-1">
            Total
          </p>

          <p className="text-2xl font-bold text-white">
            {summary.total}
          </p>

        </div>

        {/* Attendance Matches */}
        <div className="text-center">

          <p className="text-xs text-zinc-400 mb-1">
            Matched
          </p>

          <p className="text-2xl font-bold text-emerald-400">
            {summary.matched}
          </p>

        </div>

        {/* Attendance Deviations */}
        <div className="text-center">

          <p className="text-xs text-zinc-400 mb-1">
            Deviated
          </p>

          <p className="text-2xl font-bold text-orange-400">
            {summary.deviated}
          </p>

        </div>

        {/* Missing Work Logs */}
        <div className="text-center">

          <p className="text-xs text-zinc-400 mb-1">
            Unlogged
          </p>

          <p className="text-2xl font-bold text-red-400">
            {summary.unlogged}
          </p>

        </div>

        {/* Total Team Hours */}
        <div className="text-center">

          <p className="text-xs text-zinc-400 mb-1">
            Total Hours
          </p>

          <p className="text-2xl font-bold text-blue-400">
            {summary.totalHours.toFixed(1)}
          </p>

        </div>

      </div>

      {/* ======================================
          EMPLOYEE DETAILS SECTION
      ====================================== */}
      <div className="p-6">

        <h4 className="text-sm font-semibold text-white mb-4">
          Member Details
        </h4>

        <div className="space-y-3">

          {members.map((member, idx) => (

            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-prime border border-white/10 rounded-lg hover:bg-prime-80 transition-colors text-white"
            >

              {/* ==================================
                  EMPLOYEE INFORMATION
              ================================== */}
              <div className="flex-1">

                <p className="font-medium text-white">
                  {member.employee}
                </p>

                <p className="text-xs text-zinc-400">

                  Plan:
                  {" "}
                  <span className="text-white">
                    {member.plannedMode}
                  </span>

                  {" → "}

                  Actual:
                  {" "}
                  <span className="text-white">
                    {member.actualMode}
                  </span>

                </p>

              </div>

              {/* ==================================
                  ATTENDANCE METRICS
              ================================== */}
              <div className="flex items-center gap-4">

                {/* Attendance Status */}
                <div className="text-right">

                  <p className="text-xs text-zinc-400">
                    Status
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      member.attendanceStatus === "MATCH"
                        ? "text-emerald-400"
                        : member.attendanceStatus === "DEVIATION"
                        ? "text-orange-400"
                        : member.attendanceStatus === "UNLOGGED"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {member.attendanceStatus}
                  </p>

                </div>

                {/* Worked Hours */}
                <div className="text-right w-16">

                  <p className="text-xs text-zinc-400">
                    Hours
                  </p>

                  <p className="text-sm font-semibold text-white">
                    {member.workedHours.toFixed(1)}h
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default TeamSnapshotTable;