/*
==================================================
ATTENDANCE EXCEPTIONS COMPONENT
--------------------------------------------------
Component:
AttendanceExceptions

Props:
- snapshot
- isLoading

Purpose:
Displays team members whose attendance
does not match their planned work mode.

Attendance Exceptions:
- DEVIATION
- UNLOGGED
- UNEXPECTED

Used In:
Manager Teams Page

Business Value:
Helps managers quickly identify attendance
issues and take corrective action without
reviewing every employee manually.

Data Source:
GET /api/teams/:id/daily-snapshot

Workflow:
1. Receive daily snapshot data
2. Filter members with attendance issues
3. Categorize exceptions
4. Display actionable alerts

Return:
Attendance exception dashboard card.
==================================================
*/

import { AlertTriangle, Clock, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AttendanceExceptions = ({ snapshot, isLoading }) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  attendance exception data is loading.

  Business Logic:
  Prevents layout shifts and provides
  immediate visual feedback.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="rounded-lg border border-primary/20 p-6 mb-8 animate-pulse bg-prime text-white">

        {/* Card Title Skeleton */}
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>

        {/* Exception Row Skeletons */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-white/10 rounded w-full"></div>
          ))}
        </div>

      </div>
    );
  }

  /*
  ==========================================
  SNAPSHOT MEMBERS
  ------------------------------------------
  Purpose:
  Extracts employee records from the
  daily snapshot response.

  Fallback:
  Empty array when snapshot data
  is unavailable.
  ==========================================
  */
  const members = snapshot?.members || [];

  /*
  ==========================================
  ATTENDANCE EXCEPTION FILTER
  ------------------------------------------
  Purpose:
  Identifies employees whose actual
  attendance differs from expectations.

  Included Statuses:
  - DEVIATION
  - UNLOGGED
  - UNEXPECTED

  Excluded:
  - MATCH

  Business Logic:
  Managers only need to review employees
  with attendance anomalies.
  ==========================================
  */
  const exceptions = members.filter(
    (member) => member.attendanceStatus !== "MATCH"
  );

  /*
  ==========================================
  NO EXCEPTIONS STATE
  ------------------------------------------
  Purpose:
  Displays a positive confirmation when
  all team members are compliant.

  Business Value:
  Provides managers with immediate
  reassurance that no action is required.
  ==========================================
  */
  if (exceptions.length === 0) {
    return (
      <div className="rounded-lg border border-primary/20 p-6 mb-8 bg-prime text-white">

        <h3 className="text-lg font-semibold text-white mb-4">Attendance Exceptions</h3>

        <p className="text-white/80">✓ All team members are on track</p>

      </div>
    );
  }

  /*
  ==========================================
  EXCEPTIONS DASHBOARD
  ------------------------------------------
  Purpose:
  Displays all attendance anomalies for
  manager review.

  Features:
  - Exception categorization
  - Visual status indicators
  - Planned vs Actual comparison
  - Exception count summary

  Business Value:
  Enables rapid attendance monitoring.
  ==========================================
  */
  return (
  <div className="rounded-lg border border-primary/20 p-6 mb-8 bg-prime text-white">

      {/* ======================================
          SECTION HEADER
      ====================================== */}
      <h3 className="text-lg font-semibold text-white mb-6">
        Attendance Exceptions
      </h3>

      {/* ======================================
          EXCEPTION LIST
      ====================================== */}
      <div className="space-y-4">

        {exceptions.map((member, idx) => {

          /*
          ====================================
          EXCEPTION CLASSIFICATION
          ------------------------------------
          Purpose:
          Assigns visual styling and labels
          based on attendance status.

          Supported Types:
          - DEVIATION
          - UNLOGGED
          - UNEXPECTED
          ====================================
          */
          let icon = AlertTriangle;
          let bgColor = "bg-orange-500/20 border-orange-500/30";
          let textColor = "text-orange-300";
          let statusText = "Deviation";

          /*
          ====================================
          UNLOGGED ATTENDANCE
          ------------------------------------
          Employee did not submit a work log.
          ====================================
          */
          if (member.attendanceStatus === "UNLOGGED") {
            icon = Clock;
            bgColor = "bg-red-500/20 border-red-500/30";
            textColor = "text-red-300";
            statusText = "Unlogged";
          }

          /*
          ====================================
          UNEXPECTED ATTENDANCE
          ------------------------------------
          Employee attendance pattern differs
          significantly from expectations.
          ====================================
          */
          else if (member.attendanceStatus === "UNEXPECTED") {
            icon = UserX;
            bgColor = "bg-yellow-500/20 border-yellow-500/30";
            textColor = "text-yellow-300";
            statusText = "Unexpected";
          }

          const Icon = icon;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg border ${bgColor} transition-colors hover:bg-opacity-40`}
            >

              {/* ==================================
                  EMPLOYEE DETAILS
              ================================== */}
              <div className="flex items-center gap-4">

                <Icon
                  size={20}
                  className={textColor}
                />

                <div>

                  {/* Employee Name */}
                  <p className="font-medium text-white">
                    {member.employee}
                  </p>

                  {/* Planned vs Actual Mode */}
                  <p className="text-xs text-zinc-400">
                    Planned: {member.plannedMode}
                    {" | "}
                    Actual: {member.actualMode}
                  </p>

                </div>

              </div>

              {/* ==================================
                  STATUS BADGE
              ================================== */}
              <Badge className={`${bgColor} border`}>
                {statusText}
              </Badge>

            </div>
          );
        })}

      </div>

      {/* ======================================
          SUMMARY SECTION
      ====================================== */}
      <div className="mt-6 p-4 bg-prime-80 border border-white/10 rounded-lg text-white/80">

        <p className="text-xs">
          <strong className="text-white">{exceptions.length}</strong>
          {" "}
          team member
          {exceptions.length !== 1 ? "s" : ""}
          {" "}
          with attendance exceptions
        </p>

      </div>

    </div>
  );
};

export default AttendanceExceptions;