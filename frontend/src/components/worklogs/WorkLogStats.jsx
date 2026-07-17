import { ScrollText, Timer, Building2, Wifi } from "lucide-react";

/*
==================================================
WORK LOG STATS
--------------------------------------------------
Component:
WorkLogStats

Props:
- stats
- isLoading

Purpose:
Displays key work log metrics in a responsive
grid of statistic cards.

Used In:
Employee Work Logs Page

Data Source:
Derived from GET /api/worklogs/me

Displayed Metrics:
- Total Work Logs
- Average Working Hours
- Office Days
- Remote Days

Business Value:
Provides employees with a quick overview of
their work log history and work mode trends
without requiring additional API requests.

Workflow:
1. Receive computed statistics from parent.
2. Display loading skeleton while fetching.
3. Render responsive metric cards.
4. Show zero values when data is unavailable.

Return:
Responsive statistics card grid.
==================================================
*/

/*
==================================================
STAT CARD CONFIGURATION
--------------------------------------------------
Purpose:
Defines all statistic cards rendered by the
component.

Fields:
- key   : Property name inside stats object.
- label : Display title.
- icon  : Lucide icon.

Business Logic:
Centralizes card configuration, making it
easy to add or remove statistics without
modifying rendering logic.
==================================================
*/
const STAT_CONFIG = [
  {
    key: "totalLogs",
    label: "Total Logs",
    icon: ScrollText,
  },
  {
    key: "averageHours",
    label: "Avg Hours/Day",
    icon: Timer,
  },
  {
    key: "officeDays",
    label: "Office Days",
    icon: Building2,
  },
  {
    key: "remoteDays",
    label: "Remote Days",
    icon: Wifi,
  },
];

/*
==================================================
WORK LOG STATS COMPONENT
--------------------------------------------------
Props:
- stats
- isLoading

Purpose:
Displays summarized work log statistics
using reusable metric cards.

Return:
Responsive statistic card grid.
==================================================
*/
const WorkLogStats = ({ stats, isLoading }) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Displays skeleton cards while statistics
  are being loaded from the server.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-3xl bg-muted"
          />
        ))}

      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* ======================================
          STATISTIC CARDS
          --------------------------------------
          Iterates through predefined stat
          configuration and renders a card for
          each work log metric.
      ====================================== */}
      {STAT_CONFIG.map(({ key, label, icon: Icon }) => (

        <div
          key={key}
          className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
        >

          <div className="flex items-start justify-between">

            {/* Metric Information */}
            <div>

              {/* Card Label */}
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                {label}
              </p>

              {/* Metric Value */}
              <p className="mt-3 text-4xl font-bold text-white">
                {stats?.[key] ?? 0}
              </p>

            </div>

            {/* Metric Icon */}
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

export default WorkLogStats;