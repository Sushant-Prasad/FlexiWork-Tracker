import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

/*
==================================================
CHART.JS REGISTRATION
--------------------------------------------------
Purpose:
Registers all Chart.js components required
to render the Leave Usage Bar Chart.

Registered Components:
- BarElement
- CategoryScale
- LinearScale
- Tooltip

Business Logic:
Chart.js requires chart elements and
plugins to be registered before they
can be used.
==================================================
*/
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);

/*
==================================================
LEAVE USAGE CHART
--------------------------------------------------
Component:
LeaveUsageChart

Props:
- leaves
- isLoading

Purpose:
Displays a monthly bar chart showing the
number of approved leave days taken by
the employee during the current year.

Used In:
Employee Leave Management Page

Data Source:
GET /api/leaves/me

Chart Type:
Bar Chart

Metrics Displayed:
- Approved Leave Days
- Monthly Leave Distribution
- Total Approved Leave Days

Features:
- Monthly Leave Analysis
- Current Year Filtering
- Responsive Bar Chart
- Loading Skeleton
- Custom Tooltips
- Dynamic Colors

Business Value:
Helps employees understand their leave
utilization throughout the year and
identify periods with higher leave usage.

Workflow:
1. Receive leave history.
2. Filter approved leave requests.
3. Keep only current year's data.
4. Calculate leave days for each month.
5. Generate Chart.js dataset.
6. Display total approved leave days.

Returns:
Interactive monthly leave usage chart.
==================================================
*/

/*
==================================================
MONTH LABELS
--------------------------------------------------
Purpose:
Stores month names used along the X-axis
of the chart.

Business Logic:
Centralizes month labels for easier
maintenance.
==================================================
*/
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
Includes both the start and end dates
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
LEAVE USAGE CHART COMPONENT
--------------------------------------------------
Props:
- leaves
- isLoading

Purpose:
Displays approved leave usage for each
month of the current year.

Return:
Responsive Bar Chart.
==================================================
*/
const LeaveUsageChart = ({
  leaves,
  isLoading,
}) => {

  /*
  ==========================================
  CURRENT YEAR
  ------------------------------------------
  Used to filter leave requests so that
  only the current year's data is shown.
  ==========================================
  */
  const currentYear =
    new Date().getFullYear();

  /*
  ==========================================
  MONTHLY LEAVE CALCULATION
  ------------------------------------------
  Calculates approved leave days for
  every month.

  Business Logic:
  - Only approved leave requests are
    considered.
  - Only leave requests belonging to
    the current year are included.

  Optimization:
  useMemo prevents unnecessary
  recalculations unless leave data
  changes.
  ==========================================
  */
  const monthlyData = useMemo(() => {

    const counts = Array(12).fill(0);

    (leaves || [])
      .filter(
        (leave) =>
          leave.status ===
            "APPROVED" &&
          leave.startDate?.startsWith(
            String(currentYear)
          )
      )
      .forEach((leave) => {

        const month =
          parseInt(
            leave.startDate.split("-")[1],
            10
          ) - 1;

        counts[month] += getDayCount(
          leave.startDate,
          leave.endDate
        );

      });

    return counts;

  }, [leaves, currentYear]);

  /*
  ==========================================
  CHART DATA
  ------------------------------------------
  Converts monthly leave statistics into
  Chart.js dataset format.

  Business Logic:
  Months without leave are displayed
  using lighter bars for improved
  visualization.
  ==========================================
  */
  const chartData = {

    labels: MONTHS,

    datasets: [
      {
        label: "Leave Days",

        data: monthlyData,

        backgroundColor:
          monthlyData.map((days) =>
            days > 0
              ? "rgba(36, 91, 167, 0.85)"
              : "rgba(36, 91, 167, 0.1)"
          ),

        hoverBackgroundColor:
          "rgba(36, 91, 167, 1)",

        borderRadius: 8,

        borderSkipped: false,
      },
    ],
  };

  /*
  ==========================================
  CHART OPTIONS
  ------------------------------------------
  Configures chart appearance and
  behaviour.

  Features:
  - Responsive Layout
  - Hidden Legend
  - Custom Tooltip
  - Styled Axes
  - Integer Y-Axis
  ==========================================
  */
  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        /*
        --------------------------------------
        Tooltip Label
        --------------------------------------
        Displays leave days for the selected
        month.
        --------------------------------------
        */
        callbacks: {

          label: (context) =>
            ` ${context.parsed.y} ${
              context.parsed.y === 1
                ? "day"
                : "days"
            }`,

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

    scales: {

      /*
      --------------------------------------
      X-Axis Configuration
      --------------------------------------
      */
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },

      /*
      --------------------------------------
      Y-Axis Configuration
      --------------------------------------
      */
      y: {
        beginAtZero: true,

        ticks: {
          color: "#64748B",
          font: {
            size: 12,
          },
          stepSize: 1,
          precision: 0,
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

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Displays a placeholder chart while
  leave statistics are loading.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
    );
  }

  /*
  ==========================================
  TOTAL LEAVE DAYS
  ------------------------------------------
  Calculates the total approved leave
  days for the current year.
  ==========================================
  */
  const totalDays =
    monthlyData.reduce(
      (total, days) => total + days,
      0
    );

  return (

    <div>

      {/* ==================================
          CHART SUMMARY
          ----------------------------------
          Displays chart title and yearly
          leave summary.
      ================================== */}
      <div className="mb-2 flex items-center justify-between">

        <p className="text-xs text-muted-foreground">
          Approved leave days in {currentYear}
        </p>

        <p className="text-xs font-semibold text-foreground">
          {totalDays}{" "}
          {totalDays === 1
            ? "day"
            : "days"}{" "}
          total
        </p>

      </div>

      {/* ==================================
          BAR CHART
          ----------------------------------
          Displays monthly approved leave
          distribution.
      ================================== */}
      <div className="h-48">

        <Bar
          data={chartData}
          options={options}
        />

      </div>

    </div>

  );
};

export default LeaveUsageChart;