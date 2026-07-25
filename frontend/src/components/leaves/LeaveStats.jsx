import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/*
==================================================
LEAVE STATISTICS
--------------------------------------------------
Component:
LeaveStats

Props:
- stats
- isLoading

Purpose:
Displays a summary of the employee's leave
requests using four statistic cards:
Total Requests, Pending, Approved, and
Rejected.

Used In:
Employee Leave Management Page

Data Source:
GET /api/leaves/me

Features:
- Summary Cards
- Loading Skeleton
- Responsive Grid
- Dynamic Statistics
- Consistent Theme Styling

Business Value:
Provides employees with an instant overview
of their leave request status without
scrolling through the complete leave
history.

Workflow:
1. Receive leave statistics.
2. Display loading placeholders while
   data is being fetched.
3. Render summary cards.
4. Show count for each leave status.

Returns:
Responsive leave statistics cards.
==================================================
*/

/*
==================================================
STAT CARD CONFIGURATION
--------------------------------------------------
Purpose:
Defines configuration for every leave
statistics card.

Fields:
- key
- label
- icon
- icon background

Business Logic:
Centralizes card configuration so new
statistics can be added without changing
rendering logic.
==================================================
*/
const STAT_CONFIG = [
  {
    key: "total",
    label: "Total Requests",
    icon: ClipboardList,
    iconBg: "bg-white/15",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    iconBg: "bg-white/20",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    iconBg: "bg-white/20",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconBg: "bg-white/20",
  },
];

/*
==================================================
LOADING SKELETON
--------------------------------------------------
Purpose:
Displays placeholder statistic cards while
leave statistics are loading.

Business Logic:
Improves perceived application performance
and prevents layout shifting.
==================================================
*/
const LeaveStatSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

    {[1, 2, 3, 4].map((card) => (

      <div
        key={card}
        className="h-28 animate-pulse rounded-3xl bg-muted"
      />

    ))}

  </div>
);

/*
==================================================
LEAVE STATS COMPONENT
--------------------------------------------------
Props:
- stats
- isLoading

Purpose:
Displays summary cards containing leave
request counts for each status.

Return:
Responsive statistics card grid.
==================================================
*/
const LeaveStats = ({
  stats,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Displays skeleton cards until leave
  statistics are available.
  ==========================================
  */
  if (isLoading) {
    return <LeaveStatSkeleton />;
  }

  return (

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {STAT_CONFIG.map(
        ({
          key,
          label,
          icon: Icon,
          iconBg,
        }) => (

          /*
          ====================================
          LEAVE STATISTICS CARD
          ------------------------------------
          Displays one leave metric with
          corresponding icon and value.
          ====================================
          */
          <div
            key={key}
            className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
          >

            <div className="flex items-start justify-between">

              {/* Statistic Information */}
              <div>

                {/* Statistic Label */}
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                  {label}
                </p>

                {/* Statistic Value */}
                <p className="mt-3 text-4xl font-bold text-white">
                  {stats[key] ?? 0}
                </p>

              </div>

              {/* Statistic Icon */}
              <div
                className={`rounded-2xl p-3 ${iconBg}`}
              >
                <Icon
                  size={22}
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

export default LeaveStats;