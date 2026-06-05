/*
==================================================
TASK CHART COMPONENT
--------------------------------------------------
Component:
TaskChart

Purpose:
Displays task analytics and productivity metrics
using Chart.js bar visualization.

Used In:
- Employee Dashboard
- Manager Dashboard
- Task Analytics
- Productivity Reports
- Team Performance Insights

Features:
- Responsive chart rendering
- Enterprise dashboard styling
- Task trend visualization
- Chart.js integration

Business Value:
Helps managers and employees analyze:
- Task completion trends
- Productivity patterns
- Pending vs completed tasks
- Team workload distribution

Chart Type:
Bar Chart

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
  Handles categorical X-axis labels.

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
  Required for point rendering.

  LineElement:
  Required for line charts.

  ArcElement:
  Required for pie/doughnut charts.

  BarElement:
  Required for rendering bar charts.
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
  Displays hover information.

  Legend:
  Displays dataset labels.
  ==========================================
  */
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

/*
==================================================
CHART.JS REGISTRATION
--------------------------------------------------
Purpose:
Registers required Chart.js modules globally.

Why Required:
Chart.js v3+ requires explicit module registration
for tree-shaking and optimized bundle size.

Business Logic:
Ensures efficient frontend performance by loading
only necessary chart modules.
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
BAR CHART CONFIGURATION
--------------------------------------------------
Purpose:
Defines reusable enterprise chart styling
and behavior settings.

Features:
- Fully responsive
- Minimal enterprise UI
- Optimized dashboard readability
- Professional axis/grid styling

Business Logic:
Used for workforce and productivity analytics
inside enterprise dashboards.
==================================================
*/
const options = {
  responsive: true,

  /*
  ==========================================
  Allows container-controlled chart sizing
  for responsive dashboard layouts.
  ==========================================
  */
  maintainAspectRatio: false,

  plugins: {
    /*
    ========================================
    LEGEND CONFIGURATION
    ----------------------------------------
    Hides legend for cleaner analytics cards.
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
    Displays task categories or time labels.
    ========================================
    */
    x: {
      ticks: {
        color: "#64748B",
      },

      /*
      ======================================
      Removes vertical grid lines for
      modern enterprise dashboard styling.
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
    Displays numeric task metrics.
    ========================================
    */
    y: {
      ticks: {
        color: "#64748B",
      },

      /*
      ======================================
      Subtle horizontal grid improves
      readability of productivity metrics.
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
TASK CHART COMPONENT
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
Responsive task analytics bar chart.

Business Logic:
Visualizes:
- Completed tasks
- Pending tasks
- Productivity trends
- Team workload
- Weekly task analytics
==================================================
*/
const TaskChart = ({ data }) => {

  /*
  ==========================================
  Render Bar Chart
  ------------------------------------------
  Uses enterprise chart configuration with
  dynamic task analytics dataset.
  ==========================================
  */
  return <Bar data={data} options={options} />;
};

export default TaskChart;