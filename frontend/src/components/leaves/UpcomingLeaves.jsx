import { CalendarCheck, Clock } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
UPCOMING LEAVES
--------------------------------------------------
Component:
UpcomingLeaves

Props:
- leaves
- isLoading

Purpose:
Displays the employee's upcoming approved
leave requests in chronological order.

Used In:
Employee Leave Management Page

Data Source:
GET /api/leaves/me

Features:
- Upcoming Leave List
- Date Range Formatting
- Leave Duration
- Leave Type Badge
- Loading Skeleton
- Empty State
- Responsive Layout

Business Value:
Provides employees with quick visibility
into their upcoming approved leave plans,
helping them prepare work schedules and
manage upcoming absences.

Workflow:
1. Receive leave history.
2. Filter approved future leaves.
3. Sort by upcoming start date.
4. Display the next five leave requests.
5. Show loading or empty state when
   applicable.

Returns:
Upcoming leave cards.
==================================================
*/

/*
==================================================
LEAVE TYPE LABELS
--------------------------------------------------
Purpose:
Maps leave type codes to user-friendly
display names.

Business Logic:
Provides descriptive labels without
changing backend values.
==================================================
*/
const TYPE_LABELS = {
  PTO: "Paid Time Off",
  SICK: "Sick Leave",
  WFH: "Work From Home",
};

/*
==================================================
FORMAT DATE RANGE
--------------------------------------------------
Purpose:
Formats leave start and end dates into
a readable date range.

Parameters:
- startDate
- endDate

Returns:
Formatted leave duration string.

Business Logic:
Displays a single date for one-day
leave requests and a date range for
multi-day leaves.
==================================================
*/
const formatDateRange = (
  startDate,
  endDate
) => {

  const start = new Date(
    startDate + "T00:00:00"
  );

  const end = new Date(
    endDate + "T00:00:00"
  );

  const options = {
    day: "numeric",
    month: "short",
  };

  if (startDate === endDate) {
    return start.toLocaleDateString(
      "en-IN",
      {
        ...options,
        year: "numeric",
      }
    );
  }

  const sameYear =
    start.getFullYear() ===
    end.getFullYear();

  return `${start.toLocaleDateString(
    "en-IN",
    options
  )} – ${end.toLocaleDateString(
    "en-IN",
    {
      ...options,
      year: sameYear
        ? undefined
        : "numeric",
    }
  )} ${end.getFullYear()}`;

};

/*
==================================================
CALCULATE LEAVE DAYS
--------------------------------------------------
Purpose:
Calculates the total duration of a leave
request.

Parameters:
- startDate
- endDate

Returns:
Number of leave days.

Business Logic:
Both start and end dates are included
within the leave duration.
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
LOADING SKELETON
--------------------------------------------------
Purpose:
Displays placeholder cards while upcoming
leave data is loading.

Business Logic:
Improves perceived performance and
prevents layout shifting.
==================================================
*/
const UpcomingLeavesSkeleton = () => (

  <div className="space-y-3">

    {[1, 2].map((card) => (

      <div
        key={card}
        className="h-20 animate-pulse rounded-2xl bg-muted"
      />

    ))}

  </div>

);

/*
==================================================
UPCOMING LEAVES COMPONENT
--------------------------------------------------
Props:
- leaves
- isLoading

Purpose:
Displays the next upcoming approved leave
requests for the employee.

Return:
Upcoming leave request cards.
==================================================
*/
const UpcomingLeaves = ({
  leaves,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Displays loading placeholders while
  leave data is being fetched.
  ==========================================
  */
  if (isLoading) {
    return <UpcomingLeavesSkeleton />;
  }

  /*
  ==========================================
  CURRENT DATE
  ------------------------------------------
  Used to determine whether a leave
  request is upcoming.

  Format:
  YYYY-MM-DD
  ==========================================
  */
  const todayStr =
    new Date()
      .toISOString()
      .split("T")[0];

  /*
  ==========================================
  UPCOMING LEAVES
  ------------------------------------------
  Business Logic:
  - Only approved leave requests.
  - End date must not have passed.
  - Sorted by nearest start date.
  - Maximum five upcoming leaves.
  ==========================================
  */
  const upcoming = leaves
    .filter(
      (leave) =>
        leave.status ===
          "APPROVED" &&
        leave.endDate >= todayStr
    )
    .sort((a, b) =>
      a.startDate.localeCompare(
        b.startDate
      )
    )
    .slice(0, 5);

  /*
  ==========================================
  EMPTY STATE
  ------------------------------------------
  Displayed when there are no approved
  upcoming leave requests.
  ==========================================
  */
  if (upcoming.length === 0) {

    return (

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 py-10 text-center">

        <CalendarCheck
          size={36}
          className="text-muted-foreground/50"
        />

        <p className="mt-3 text-sm font-medium text-muted-foreground">
          No upcoming approved leaves
        </p>

      </div>

    );

  }

  return (

    <div className="space-y-3">

      {upcoming.map((leave) => {

        /*
        --------------------------------------
        Calculate leave duration.
        --------------------------------------
        */
        const days = getDayCount(
          leave.startDate,
          leave.endDate
        );

        return (

          <div
            key={leave._id}
            className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4 transition hover:bg-muted/40"
          >

            {/* ==============================
                LEAVE INFORMATION
            ============================== */}
            <div className="flex items-center gap-4">

              {/* Leave Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">

                <CalendarCheck size={20} />

              </div>

              {/* Leave Details */}
              <div>

                <p className="text-sm font-semibold text-foreground">
                  {TYPE_LABELS[
                    leave.type
                  ] || leave.type}
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">

                  <Clock size={12} />

                  {formatDateRange(
                    leave.startDate,
                    leave.endDate
                  )}

                </p>

              </div>

            </div>

            {/* ==============================
                LEAVE SUMMARY
            ============================== */}
            <div className="flex flex-col items-end gap-1.5">

              {/* Leave Type Badge */}
              <Badge variant="secondary">
                {leave.type}
              </Badge>

              {/* Leave Duration */}
              <span className="text-xs text-muted-foreground">
                {days}{" "}
                {days === 1
                  ? "day"
                  : "days"}
              </span>

            </div>

          </div>

        );

      })}

    </div>

  );
};

export default UpcomingLeaves;