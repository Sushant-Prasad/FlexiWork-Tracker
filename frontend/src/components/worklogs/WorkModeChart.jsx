import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Building2, Wifi, Layers, PieChart } from "lucide-react";

/*
==================================================
CHART.JS REGISTRATION
--------------------------------------------------
Purpose:
Registers all Chart.js components required
to render the Doughnut chart.

Registered Components:
- ArcElement
- Tooltip

Business Logic:
Chart.js requires chart elements and plugins
to be registered before they can be used.
==================================================
*/
ChartJS.register(ArcElement, Tooltip);

/*
==================================================
WORK MODE CHART
--------------------------------------------------
Component:
WorkModeChart

Props:
- logs
- isLoading

Purpose:
Displays the distribution of employee work
modes (Office, Remote, Hybrid) using an
interactive Doughnut chart.

Used In:
Employee Work Logs Page
Employee Dashboard

Data Source:
GET /api/worklogs/me

Chart Type:
Doughnut Chart

Metrics Displayed:
- Office Days
- Remote Days
- Hybrid Days

Features:
- Responsive Doughnut Chart
- Interactive Tooltips
- Work Mode Progress Bars
- Percentage Distribution
- Loading Skeleton
- Empty State
- Theme-based Colors

Business Value:
Provides employees with a quick overview
of how frequently they have worked from
different locations over a selected period.

Workflow:
1. Receive work log history.
2. Remove unlogged work entries.
3. Count each work mode.
4. Calculate percentage distribution.
5. Render Doughnut chart.
6. Display progress bars and statistics.

Return:
Interactive work mode distribution chart.
==================================================
*/

/*
==================================================
WORK MODE CONFIGURATION
--------------------------------------------------
Purpose:
Defines configuration for every work mode.

Fields:
- key
- label
- icon
- chart color
- background color
- text color

Business Logic:
Centralizes UI configuration for easier
maintenance and future expansion.
==================================================
*/
const MODES = [
  {
    key: "OFFICE",
    label: "Office",
    icon: Building2,
    color: "#245BA7",
    lightColor: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    key: "REMOTE",
    label: "Remote",
    icon: Wifi,
    color: "#3B82F6",
    lightColor: "bg-accent/10",
    textColor: "text-accent",
  },
  {
    key: "HYBRID",
    label: "Hybrid",
    icon: Layers,
    color: "#93C5FD",
    lightColor: "bg-primary/5",
    textColor: "text-muted-foreground",
  },
];

const WorkModeChart = ({ logs, isLoading }) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Displays a loading placeholder while
  work log history is being fetched.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="h-44 animate-pulse rounded-2xl bg-muted" />
    );
  }

  /*
  ==========================================
  VALID WORK LOGS
  ------------------------------------------
  Purpose:
  Removes UNLOGGED entries before
  generating chart statistics.

  Business Logic:
  Only actual work days are included
  in the distribution chart.
  ==========================================
  */
  const validLogs = (logs || []).filter(
    (log) =>
      log.actualMode &&
      log.actualMode !== "UNLOGGED"
  );

  /*
  ==========================================
  WORK MODE COUNTS
  ------------------------------------------
  Calculates the total number of days
  worked in each mode.

  Metrics:
  - Office
  - Remote
  - Hybrid
  ==========================================
  */
  const counts = {
    OFFICE: validLogs.filter(
      (log) => log.actualMode === "OFFICE"
    ).length,

    REMOTE: validLogs.filter(
      (log) => log.actualMode === "REMOTE"
    ).length,

    HYBRID: validLogs.filter(
      (log) => log.actualMode === "HYBRID"
    ).length,
  };

  /*
  ==========================================
  SUMMARY METRICS
  ------------------------------------------
  total:
  Total number of logged work days.

  hasData:
  Indicates whether chart contains
  actual work log data.
  ==========================================
  */
  const total = validLogs.length;
  const hasData = total > 0;

  /*
  ==========================================
  CHART DATA
  ------------------------------------------
  Converts work mode statistics into a
  Chart.js dataset.

  Business Logic:
  Uses placeholder values when no work
  logs exist to preserve chart layout.
  ==========================================
  */
  const chartData = {
    datasets: [
      {
        data: hasData
          ? [
              counts.OFFICE,
              counts.REMOTE,
              counts.HYBRID,
            ]
          : [1, 1, 1],

        backgroundColor: hasData
          ? [
              "#245BA7",
              "#3B82F6",
              "#93C5FD",
            ]
          : [
              "#EFF6FF",
              "#EFF6FF",
              "#EFF6FF",
            ],

        borderColor: "#FFFFFF",
        borderWidth: 3,

        hoverOffset: hasData ? 6 : 0,
      },
    ],
  };

  /*
  ==========================================
  CHART OPTIONS
  ------------------------------------------
  Configures Doughnut chart behaviour.

  Features:
  - Responsive Layout
  - Hidden Legend
  - Custom Tooltips
  - Large Center Cutout
  ==========================================
  */
  const options = {
    responsive: true,

    maintainAspectRatio: false,

    cutout: "70%",

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        enabled: hasData,

        callbacks: {

          /*
          ------------------------------------
          Tooltip Label
          ------------------------------------
          Displays work mode and number
          of days.
          ------------------------------------
          */
          label: (ctx) => {

            const mode = MODES[ctx.dataIndex];

            return ` ${mode?.label}: ${
              counts[mode?.key]
            } day${
              counts[mode?.key] !== 1 ? "s" : ""
            }`;

          },

        },

        backgroundColor: "#FFFFFF",
        titleColor: "#0F172A",
        bodyColor: "#64748B",

        borderColor: "#DCE6F0",
        borderWidth: 1,

        padding: 10,
        cornerRadius: 10,
      },
    },
  };

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

      {/* ======================================
          DOUGHNUT CHART
          --------------------------------------
          Displays the visual distribution of
          employee work modes.
      ====================================== */}
      <div className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0">

        <Doughnut
          data={chartData}
          options={options}
        />

        {/* ==================================
            CENTER SUMMARY
            ----------------------------------
            Shows total work days or an
            empty-state icon.
        ================================== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          {hasData ? (
            <>
              <p className="text-2xl font-bold text-foreground leading-none">
                {total}
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                days
              </p>
            </>
          ) : (
            <PieChart
              size={22}
              className="text-muted-foreground/40"
            />
          )}

        </div>

      </div>

      {/* ======================================
          WORK MODE STATISTICS
          --------------------------------------
          Displays count, percentage and
          progress bar for each work mode.
      ====================================== */}
      <div className="flex-1 space-y-3">

        {MODES.map(
          ({
            key,
            label,
            icon: Icon,
            color,
            lightColor,
            textColor,
          }) => {

            const count = counts[key];

            const percentage = hasData
              ? Math.round((count / total) * 100)
              : 0;

            return (

              <div
                key={key}
                className="flex items-center gap-3"
              >

                {/* Work Mode Icon */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${lightColor} ${textColor}`}
                >
                  <Icon size={14} />
                </div>

                {/* Progress Information */}
                <div className="flex-1 min-w-0">

                  <div className="mb-1 flex items-center justify-between">

                    <span className="text-xs font-medium text-foreground">
                      {label}
                    </span>

                    <span className="text-xs font-semibold text-foreground">
                      {count} days
                    </span>

                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">

                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                    />

                  </div>

                </div>

                {/* Percentage */}
                <span className="w-9 shrink-0 text-right text-xs text-muted-foreground">
                  {percentage}%
                </span>

              </div>

            );
          }
        )}

        {/* ======================================
            EMPTY STATE
            --------------------------------------
            Displayed when no work logs are
            available.
        ====================================== */}
        {!hasData && (
          <p className="pt-1 text-xs text-muted-foreground">
            No work logs recorded yet.
          </p>
        )}

      </div>

    </div>
  );
};

export default WorkModeChart;