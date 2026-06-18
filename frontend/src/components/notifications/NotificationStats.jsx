/*
==================================================
NOTIFICATION STATS COMPONENT
--------------------------------------------------
Component:
NotificationStats

Props:
- stats
- isLoading

Purpose:
Displays notification analytics and
summary metrics in a card-based layout.

Used In:
Employee Notifications Page

Features:
- Total Notifications
- Unread Notifications
- Read Notifications
- Category-Based Metrics
- Loading State Support

Business Value:
Provides users with a quick overview
of notification activity and helps
prioritize unread updates.

Workflow:
1. Receive notification statistics
2. Render KPI cards
3. Display loading placeholders
4. Show notification insights

Return:
Notification summary dashboard cards.
==================================================
*/

const NotificationStats = ({
  stats,
  isLoading = false,
}) => {

  /*
  ==========================================
  NOTIFICATION ANALYTICS GRID
  ------------------------------------------
  Purpose:
  Displays high-level notification KPIs.

  Responsive Layout:
  Mobile  : 1 Column
  Tablet  : 2 Columns
  Desktop : 4 Columns

  Business Value:
  Helps users quickly understand:
  - Total notifications received
  - Pending unread notifications
  - Recently processed notifications
  - Overall notification activity
  ==========================================
  */
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {stats.map((item) => {

        /*
        ======================================
        OPTIONAL ICON COMPONENT
        --------------------------------------
        Used for visual identification of
        notification metrics.
        ======================================
        */
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
          >

            {/* ==================================
                CARD CONTENT
            ================================== */}
            <div className="flex items-start justify-between">

              {/* ==============================
                  KPI DETAILS
              ============================== */}
              <div>

                {/* KPI LABEL */}
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">

                  {item.label}

                </p>

                {/* KPI VALUE */}
                <p className="mt-3 text-4xl font-bold text-white">

                  {isLoading
                    ? "—"
                    : item.value}

                </p>

              </div>

              {/* ==============================
                  KPI ICON
              ============================== */}
              {Icon && (
                <div className="rounded-2xl bg-white/15 p-3">

                  <Icon
                    size={22}
                    className="text-white"
                  />

                </div>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default NotificationStats;