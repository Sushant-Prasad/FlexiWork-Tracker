/*
==================================================
PROFILE STATISTICS COMPONENT
--------------------------------------------------
Component:
ProfileStats

Purpose:
Displays key employee performance and
activity metrics in a compact card layout.

Used In:
Employee Profile Page

Data Sources:
- Attendance Data
- Task Data
- Leave Data
- Work Log Data

API Dependencies:
No direct API calls.

Consumes data already fetched by:
- Attendance Page
- Tasks Page
- Leave Page
- Work Logs Page

Metrics Displayed:
- Attendance Streak
- Assigned Tasks
- Approved Leaves
- Work Logs Count

Business Value:
Provides employees with a quick overview
of their engagement, productivity, and
attendance performance directly from
their profile page.

Workflow:
1. Receive previously fetched data
2. Derive profile metrics
3. Build statistics cards
4. Display KPI summary

Return:
Profile statistics grid.
==================================================
*/

import {
  CalendarCheck,
  CheckSquare,
  FileText,
  Flame,
} from "lucide-react";

/*
==================================================
PROFILE STATS
--------------------------------------------------
Component:
ProfileStats

Props:
- attendanceData
- tasksData
- leavesData
- worklogsData
- isLoading

Purpose:
Aggregates employee-related metrics from
multiple modules and displays them as
profile KPI cards.

Features:
- Attendance Insights
- Task Summary
- Leave Summary
- Work Log Summary

Business Value:
Provides employees with a personalized
performance snapshot without requiring
additional API requests.

Return:
Statistics dashboard cards.
==================================================
*/
const ProfileStats = ({
  attendanceData,
  tasksData,
  leavesData,
  worklogsData,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton cards while profile
  statistics are being prepared.

  Business Logic:
  Prevents layout shifts and improves
  perceived performance.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-3xl bg-muted"
          />
        ))}

      </div>
    );
  }

  /*
  ==========================================
  ATTENDANCE STREAK
  ------------------------------------------
  Source:
  Attendance Module

  Purpose:
  Tracks consecutive attendance days.

  Business Value:
  Encourages attendance consistency.
  ==========================================
  */
  const streak =
    attendanceData?.data?.streak ?? 0;

  /*
  ==========================================
  ASSIGNED TASKS COUNT
  ------------------------------------------
  Source:
  Task Module

  Purpose:
  Counts all tasks assigned to the user.

  Business Value:
  Provides workload visibility.
  ==========================================
  */
  const tasks =
    tasksData?.data ||
    tasksData?.tasks ||
    tasksData ||
    [];

  const assignedTasks =
    Array.isArray(tasks)
      ? tasks.length
      : 0;

  /*
  ==========================================
  APPROVED LEAVES COUNT
  ------------------------------------------
  Source:
  Leave Module

  Purpose:
  Counts approved leave requests.

  Business Value:
  Helps employees track leave usage.
  ==========================================
  */
  const leaves =
    leavesData?.data ||
    leavesData?.leaves ||
    leavesData ||
    [];

  const approvedLeaves =
    Array.isArray(leaves)
      ? leaves.filter(
          (leave) =>
            leave.status === "APPROVED"
        ).length
      : 0;

  /*
  ==========================================
  WORK LOGS COUNT
  ------------------------------------------
  Source:
  Work Log Module

  Purpose:
  Counts submitted work logs.

  Business Value:
  Indicates reporting consistency and
  daily work activity tracking.
  ==========================================
  */
  const logs =
    worklogsData?.data?.logs ||
    worklogsData?.data ||
    worklogsData ||
    [];

  const workLogs =
    Array.isArray(logs)
      ? logs.length
      : 0;

  /*
  ==========================================
  PROFILE KPI CONFIGURATION
  ------------------------------------------
  Purpose:
  Defines statistics cards rendered on
  the profile dashboard.

  Cards:
  - Attendance Streak
  - Tasks Assigned
  - Approved Leaves
  - Work Logs
  ==========================================
  */
  const STATS = [
    {
      label: "Attendance Streak",
      value: `${streak} days`,
      icon: Flame,
    },
    {
      label: "Tasks Assigned",
      value: assignedTasks,
      icon: CheckSquare,
    },
    {
      label: "Approved Leaves",
      value: approvedLeaves,
      icon: CalendarCheck,
    },
    {
      label: "Work Logs",
      value: workLogs,
      icon: FileText,
    },
  ];

  /*
  ==========================================
  PROFILE STATISTICS GRID
  ------------------------------------------
  Purpose:
  Displays KPI cards in a responsive grid.

  Layout:
  Mobile  : 1 Column
  Tablet  : 2 Columns
  Desktop : 4 Columns

  Business Value:
  Gives employees instant access to
  important personal performance metrics.
  ==========================================
  */
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {STATS.map(
        ({
          label,
          value,
          icon: Icon,
        }) => (
          <div
            key={label}
            className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
          >

            {/* ==============================
                CARD CONTENT
            ============================== */}
            <div className="flex items-start justify-between">

              {/* KPI INFORMATION */}
              <div>

                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">

                  {label}

                </p>

                <p className="mt-3 text-3xl font-bold text-white">

                  {value}

                </p>

              </div>

              {/* KPI ICON */}
              <div className="rounded-2xl bg-white/15 p-3">

                <Icon
                  size={20}
                  className="text-white"
                />

              </div>

            </div>

          </div>
        )
      )}

    </div>
  );
};

export default ProfileStats;