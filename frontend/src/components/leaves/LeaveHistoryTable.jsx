import {
  CheckCircle2,
  Clock,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
LEAVE HISTORY TABLE
--------------------------------------------------
Component:
LeaveHistoryTable

Props:
- leaves
- isLoading

Purpose:
Displays the employee's leave request
history in a responsive table with leave
type, duration, total days, reason,
approval status, and application date.

Used In:
Employee Leave Management Page

Data Source:
GET /api/leaves/me

Features:
- Leave History
- Leave Type Badges
- Status Indicators
- Date Formatting
- Day Count Calculation
- Loading Skeleton
- Empty State
- Responsive Table

Business Value:
Provides employees with complete visibility
into their leave requests, approval status,
and leave duration without requiring
additional navigation.

Workflow:
1. Receive leave request history.
2. Sort requests by newest first.
3. Format dates and calculate duration.
4. Display leave details.
5. Render loading or empty states when
   necessary.

Return:
Responsive leave history table.
==================================================
*/

/*
==================================================
LEAVE TYPE BADGE CONFIGURATION
--------------------------------------------------
Purpose:
Maps leave types to Badge variants.

Supported Types:
- PTO
- SICK
- WFH

Business Logic:
Centralizes leave type styling.
==================================================
*/
const TYPE_BADGE_VARIANT = {
  PTO: "default",
  SICK: "destructive",
  WFH: "secondary",
};

/*
==================================================
LEAVE STATUS CONFIGURATION
--------------------------------------------------
Purpose:
Defines the display configuration for
leave approval statuses.

Fields:
- label
- icon
- badge variant

Business Logic:
Provides consistent status indicators
throughout the application.
==================================================
*/
const STATUS_CONFIG = {
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    variant: "secondary",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    variant: "outline",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    variant: "destructive",
  },
};

/*
==================================================
FORMAT DATE
--------------------------------------------------
Purpose:
Formats YYYY-MM-DD into a readable
Indian date format.

Parameters:
- dateString

Returns:
Formatted date or placeholder.
==================================================
*/
const formatDate = (dateString) => {
  if (!dateString) return "—";

  return new Date(
    dateString + "T00:00:00"
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/*
==================================================
CALCULATE LEAVE DAYS
--------------------------------------------------
Purpose:
Calculates the total number of leave
days between two dates.

Parameters:
- startDate
- endDate

Returns:
Total leave duration.

Business Logic:
Includes both start and end dates.
==================================================
*/
const getDayCount = (
  startDate,
  endDate
) => {

  const difference =
    (
      new Date(endDate + "T00:00:00") -
      new Date(startDate + "T00:00:00")
    ) /
    (1000 * 60 * 60 * 24);

  return difference + 1;
};

/*
==================================================
LOADING SKELETON ROW
--------------------------------------------------
Purpose:
Displays placeholder rows while leave
history is loading.

Business Logic:
Improves perceived application
performance.
==================================================
*/
const SkeletonRow = () => (
  <tr>

    {[1, 2, 3, 4, 5, 6].map((column) => (

      <td
        key={column}
        className="py-4 pr-6"
      >
        <div className="h-4 animate-pulse rounded-full bg-muted" />
      </td>

    ))}

  </tr>
);

/*
==================================================
TABLE HEADERS
--------------------------------------------------
Purpose:
Centralizes all table column titles.

Business Logic:
Makes table structure easier to maintain.
==================================================
*/
const TABLE_HEADERS = [
  "Type",
  "Duration",
  "Days",
  "Reason",
  "Status",
  "Applied On",
];

/*
==================================================
LEAVE HISTORY TABLE COMPONENT
--------------------------------------------------
Props:
- leaves
- isLoading

Purpose:
Displays historical leave requests in
a searchable, readable tabular format.

Return:
Responsive leave history table.
==================================================
*/
const LeaveHistoryTable = ({
  leaves,
  isLoading,
}) => {

  /*
  ==========================================
  SORT LEAVE REQUESTS
  ------------------------------------------
  Purpose:
  Sorts leave requests by application
  date in descending order.

  Business Logic:
  Ensures the most recent requests are
  displayed first.
  ==========================================
  */
  const sorted = [...(leaves || [])].sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return (

    <div className="overflow-x-auto">

      <table className="w-full text-left text-sm">

        {/* ==================================
            TABLE HEADER
        ================================== */}
        <thead>

          <tr className="border-b border-border">

            {TABLE_HEADERS.map(
              (header, index) => (

                <th
                  key={header}
                  className={`pb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground ${
                    index <
                    TABLE_HEADERS.length - 1
                      ? "pr-6"
                      : ""
                  }`}
                >
                  {header}
                </th>

              )
            )}

          </tr>

        </thead>

        {/* ==================================
            TABLE BODY
        ================================== */}
        <tbody className="divide-y divide-border">

          {/* Loading State */}
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : sorted.length === 0 ? (

            /* Empty State */
            <tr>

              <td
                colSpan={6}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                No leave requests found.
              </td>

            </tr>

          ) : (

            /* Leave History Rows */
            sorted.map((leave) => {

              /*
              --------------------------------
              Resolve leave status
              --------------------------------
              */
              const status =
                STATUS_CONFIG[leave.status] || {
                  label: leave.status,
                  icon: MinusCircle,
                  variant: "outline",
                };

              const StatusIcon = status.icon;

              /*
              --------------------------------
              Calculate total leave days.
              --------------------------------
              */
              const days = getDayCount(
                leave.startDate,
                leave.endDate
              );

              /*
              --------------------------------
              Resolve badge variant.
              --------------------------------
              */
              const typeBadgeVariant =
                TYPE_BADGE_VARIANT[
                  leave.type
                ] || "outline";

              return (

                <tr
                  key={leave._id}
                  className="transition hover:bg-muted/40"
                >

                  {/* Leave Type */}
                  <td className="py-4 pr-6">

                    <Badge
                      variant={typeBadgeVariant}
                    >
                      {leave.type}
                    </Badge>

                  </td>

                  {/* Leave Duration */}
                  <td className="py-4 pr-6 text-foreground">

                    <span className="font-medium">
                      {formatDate(
                        leave.startDate
                      )}
                    </span>

                    {leave.startDate !==
                      leave.endDate && (
                      <>
                        <span className="mx-1 text-muted-foreground">
                          →
                        </span>

                        <span className="font-medium">
                          {formatDate(
                            leave.endDate
                          )}
                        </span>
                      </>
                    )}

                  </td>

                  {/* Total Leave Days */}
                  <td className="py-4 pr-6 text-muted-foreground">
                    {days}{" "}
                    {days === 1
                      ? "day"
                      : "days"}
                  </td>

                  {/* Leave Reason */}
                  <td className="max-w-[180px] py-4 pr-6">

                    <p className="truncate text-muted-foreground">
                      {leave.reason || "—"}
                    </p>

                  </td>

                  {/* Approval Status */}
                  <td className="py-4 pr-6">

                    <Badge
                      variant={status.variant}
                      className="gap-1"
                    >

                      <StatusIcon size={11} />

                      {status.label}

                    </Badge>

                  </td>

                  {/* Applied Date */}
                  <td className="py-4 text-muted-foreground">

                    {leave.appliedAt
                      ? formatDate(
                          leave.appliedAt.slice(
                            0,
                            10
                          )
                        )
                      : formatDate(
                          leave.createdAt?.slice(
                            0,
                            10
                          )
                        )}

                  </td>

                </tr>

              );
            })

          )}

        </tbody>

      </table>

    </div>
  );
};

export default LeaveHistoryTable;