import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";

/*
==================================================
CHART.JS REGISTRATION
--------------------------------------------------
Purpose:
Registers all Chart.js components required
for rendering the work hours line chart.

Registered Components:
- LineElement
- PointElement
- CategoryScale
- LinearScale
- Tooltip
- Filler

Business Logic:
Chart.js requires components to be
registered before they can be used.
==================================================
*/
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler
);

/*
==================================================
WORK HOURS CHART COMPONENT
--------------------------------------------------
Component:
WorkHoursChart

Props:
- logs
- isLoading

Purpose:
Displays the employee's daily worked hours
using an interactive line chart.

Used In:
Employee Work Logs Page
Employee Dashboard

Data Source:
GET /api/worklogs/me

Chart Type:
Line Chart

Metrics Displayed:
- Worked Hours
- Daily Trend

Features:
- Responsive Layout
- Animated Line Graph
- Interactive Tooltips
- Area Fill
- Loading Skeleton
- Theme-based Styling

Business Value:
Helps employees visualize their work
patterns, monitor daily productivity,
and identify fluctuations in working
hours over recent days.

Workflow:
1. Receive work log history.
2. Show loading placeholder if data is
   still being fetched.
3. Extract recent work log entries.
4. Prepare Chart.js dataset.
5. Configure chart options.
6. Render responsive line chart.

Return:
Interactive work hours trend chart.
==================================================
*/

const WorkHoursChart = ({
  logs,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays a skeleton placeholder while
  work log data is loading.

  Business Logic:
  Prevents layout shifts and provides
  better user experience.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="h-52 animate-pulse rounded-2xl bg-muted" />
    );
  }

  /*
  ==========================================
  RECENT WORK LOGS
  ------------------------------------------
  Purpose:
  Retrieves the latest 14 work log
  entries and arranges them in
  chronological order.

  Business Logic:
  Keeps the chart compact while showing
  recent work activity.
  ==========================================
  */
  const recent = [...(logs || [])]
    .slice(0, 14)
    .reverse();

  /*
  ==========================================
  CHART DATA
  ------------------------------------------
  Purpose:
  Converts work log records into a
  Chart.js compatible dataset.

  X-Axis:
  Work Date

  Y-Axis:
  Worked Hours

  Business Logic:
  Maps backend work log data into
  visual chart points.
  ==========================================
  */
  const data = {
    labels: recent.map((log) =>
      log.date
        ? new Date(
            log.date + "T00:00:00"
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })
        : ""
    ),

    datasets: [
      {
        label: "Hours Worked",

        data: recent.map((log) =>
          Number(log.workedHours || 0)
        ),

        /*
        ======================================
        CHART APPEARANCE
        --------------------------------------
        Uses the application's primary
        theme color for consistency.
        ======================================
        */

        borderColor: "#245BA7",
        backgroundColor: "rgba(36, 91, 167, 0.12)",

        tension: 0.4,
        fill: true,

        pointBackgroundColor: "#245BA7",
        pointRadius: 5,
        pointHoverRadius: 7,

        borderWidth: 2.5,
      },
    ],
  };

  /*
  ==========================================
  CHART CONFIGURATION
  ------------------------------------------
  Purpose:
  Defines chart behaviour, tooltip
  styling, responsiveness, and axis
  appearance.

  Features:
  - Responsive Layout
  - Custom Tooltips
  - Hidden Legend
  - Styled Axes
  - Theme Colors
  ==========================================
  */
  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      /*
      --------------------------------------
      Legend
      --------------------------------------
      Hidden because only one dataset is
      displayed.
      --------------------------------------
      */
      legend: {
        display: false,
      },

      /*
      --------------------------------------
      Tooltip Configuration
      --------------------------------------
      Displays worked hours when hovering
      over a chart point.
      --------------------------------------
      */
      tooltip: {

        callbacks: {

          label: (ctx) =>
            ` ${ctx.parsed.y} hrs`,

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

    /*
    ========================================
    AXIS CONFIGURATION
    ========================================
    */
    scales: {

      /*
      --------------------------------------
      X-Axis
      --------------------------------------
      Displays work log dates.
      --------------------------------------
      */
      x: {

        grid: {
          display: false,
        },

        ticks: {
          color: "#64748B",
          font: {
            size: 11,
          },
        },

        border: {
          display: false,
        },

      },

      /*
      --------------------------------------
      Y-Axis
      --------------------------------------
      Displays worked hours.

      Range:
      0–12 Hours
      --------------------------------------
      */
      y: {

        beginAtZero: true,

        max: 12,

        ticks: {

          color: "#64748B",

          font: {
            size: 11,
          },

          stepSize: 2,

        },

        grid: {
          color:
            "rgba(220, 230, 240, 0.6)",
        },

        border: {
          display: false,
        },

      },

    },

  };

  return (

    /*
    ==========================================
    CHART CONTAINER
    ------------------------------------------
    Purpose:
    Provides a fixed-height responsive
    container for the line chart.

    Business Value:
    Ensures consistent sizing across
    dashboards and work log pages.
    ==========================================
    */
    <div className="h-52">

      <Line
        data={data}
        options={options}
      />

    </div>
  );
};

export default WorkHoursChart;