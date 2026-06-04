/*
==================================================
ATTENDANCE CHART COMPONENT
--------------------------------------------------
Component:
AttendanceChart

Purpose:
Displays attendance trends and workforce analytics
using Chart.js line visualization.

Used In:
- Employee Attendance Dashboard
- Manager Attendance Analytics
- Team Insights
- System Analytics

Features:
- Responsive chart rendering
- Enterprise dashboard styling
- Attendance trend visualization
- Smooth integration with Chart.js

Business Value:
Provides managers and employees with visual insights
into attendance consistency, workforce behavior,
and productivity trends.

Chart Type:
Line Chart

Dependencies:
- react-chartjs-2
- chart.js
==================================================
*/

import {
  Chart as ChartJS,

  /*
  ==========================================
  CHART SCALES
  ------------------------------------------
  CategoryScale:
  Handles X-axis categories such as days/months.

  LinearScale:
  Handles numeric Y-axis values.
  ==========================================
  */
  CategoryScale,
  LinearScale,

  /*
  ==========================================
  CHART ELEMENTS
  ------------------------------------------
  PointElement:
  Renders chart points.

  LineElement:
  Renders connecting line paths.

  ArcElement:
  Required for pie/doughnut charts.

  BarElement:
  Required for bar charts.
  ==========================================
  */
  PointElement,
  LineElement,
  ArcElement,
  BarElement,

  /*
  ==========================================
  CHART PLUGINS
  ------------------------------------------
  Tooltip:
  Displays hover details.

  Legend:
  Displays dataset labels.
  ==========================================
  */
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

/*
==================================================
CHART.JS REGISTRATION
--------------------------------------------------
Purpose:
Registers all required chart modules globally.

Why Required:
Chart.js v3+ requires explicit registration
for tree-shaking optimization.

Business Logic:
Ensures only required chart modules are loaded,
improving frontend performance.
==================================================
*/
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

/*
==================================================
CHART CONFIGURATION
--------------------------------------------------
Purpose:
Defines reusable enterprise chart styling
and behavior configuration.

Features:
- Fully responsive
- Professional dashboard colors
- Minimal grid styling
- Hidden legend for compact UI

Business Logic:
Optimized for HRMS/workforce analytics dashboards.
==================================================
*/
const options = {
  responsive: true,

  /*
  ==========================================
  Allows chart container to control height
  instead of Chart.js forcing aspect ratio.
  ==========================================
  */
  maintainAspectRatio: false,

  plugins: {
    /*
    ========================================
    Legend Configuration
    ----------------------------------------
    Hides dataset legend for cleaner UI.
    ========================================
    */
    legend: {
      display: false,
    },
  },

  scales: {
    /*
    ========================================
    X-AXIS CONFIGURATION
    ----------------------------------------
    Displays attendance timeline labels.
    ========================================
    */
    x: {
      ticks: {
        color: "#64748B",
      },

      /*
      ======================================
      Removes vertical grid lines for
      cleaner enterprise appearance.
      ======================================
      */
      grid: {
        display: false,
      },
    },

    /*
    ========================================
    Y-AXIS CONFIGURATION
    ----------------------------------------
    Displays attendance/work-hour metrics.
    ========================================
    */
    y: {
      ticks: {
        color: "#64748B",
      },

      /*
      ======================================
      Subtle horizontal grid lines improve
      readability for analytics.
      ======================================
      */
      grid: {
        color: "#E2E8F0",
      },
    },
  },
};

/*
==================================================
ATTENDANCE CHART COMPONENT
--------------------------------------------------
Props:
- data:
  Chart.js formatted dataset object.

Expected Format:
{
  labels: [],
  datasets: []
}

Return:
Interactive responsive line chart.

Business Logic:
Visualizes attendance analytics such as:
- Worked hours trends
- Attendance consistency
- Team productivity
- Daily workforce activity
==================================================
*/
const AttendanceChart = ({ data }) => {

  /*
  ==========================================
  Render Line Chart
  ------------------------------------------
  Uses enterprise-level reusable chart
  configuration and dynamic dataset input.
  ==========================================
  */
  return <Line data={data} options={options} />;
};

export default AttendanceChart;