/*
==================================================
WORK MODE DISTRIBUTION CHART
--------------------------------------------------
Component:
WorkModeChart

Purpose:
Visualizes how team members are distributed
across different work modes using a
Doughnut Chart.

Used In:
Manager Teams Dashboard

Related API:
GET /api/teams/:id/daily-snapshot

Chart Type:
Doughnut Chart

Work Modes:
- OFFICE
- REMOTE
- HYBRID
- OTHER

Business Value:
Provides managers with an immediate view
of workforce allocation across office,
remote, and hybrid work arrangements.

Workflow:
1. Receive daily snapshot data
2. Calculate work mode counts
3. Generate chart dataset
4. Render workforce distribution chart

Return:
Work mode analytics visualization.
==================================================
*/

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

/*
==================================================
CHART.JS REGISTRATION
--------------------------------------------------
Purpose:
Registers required Doughnut Chart modules.

Modules:
- ArcElement
- Tooltip
- Legend

Business Logic:
Required by Chart.js v3+ to enable
tree-shaking and reduce bundle size.
==================================================
*/
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

/*
==================================================
WORK MODE CHART COMPONENT
--------------------------------------------------
Component:
WorkModeChart

Props:
- snapshot
- isLoading

Purpose:
Displays workforce distribution across
different work modes.

Business Value:
Helps managers:
- Monitor hybrid workforce adoption
- Track office utilization
- Analyze workforce allocation
- Support capacity planning

Return:
Interactive Doughnut Chart.
==================================================
*/
const WorkModeChart = ({
  snapshot,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays loading skeleton while chart
  data is being retrieved.

  Business Logic:
  Prevents layout shifts and improves
  user experience during API calls.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 animate-pulse text-white">

        {/* Chart Title Skeleton */}
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>

        {/* Chart Area Skeleton */}
        <div className="w-full h-48 bg-white/10 rounded"></div>

      </div>
    );
  }

  /*
  ==========================================
  SNAPSHOT DATA EXTRACTION
  ------------------------------------------
  Purpose:
  Extracts employee records from the
  daily snapshot response.

  Fallback:
  Empty array when data is unavailable.
  ==========================================
  */
  const members = snapshot?.members || [];

  /*
  ==========================================
  WORK MODE CALCULATIONS
  ------------------------------------------
  Purpose:
  Calculates workforce distribution
  across supported work modes.

  Categories:
  - OFFICE
  - REMOTE
  - HYBRID
  - OTHER

  Business Value:
  Provides workforce allocation insights.
  ==========================================
  */

  /* Office Workforce Count */
  const officeCount = members.filter(
    (member) => member.actualMode === "OFFICE"
  ).length;

  /* Remote Workforce Count */
  const remoteCount = members.filter(
    (member) => member.actualMode === "REMOTE"
  ).length;

  /* Hybrid Workforce Count */
  const hybridCount = members.filter(
    (member) => member.actualMode === "HYBRID"
  ).length;

  /*
  ==========================================
  OTHER WORK MODES
  ------------------------------------------
  Includes:
  - UNLOGGED
  - UNKNOWN
  - Future custom work modes

  Business Logic:
  Ensures all employees are accounted for.
  ==========================================
  */
  const otherCount = members.filter(
    (member) =>
      member.actualMode !== "OFFICE" &&
      member.actualMode !== "REMOTE" &&
      member.actualMode !== "HYBRID"
  ).length;

  /*
  ==========================================
  TOTAL WORKFORCE
  ------------------------------------------
  Purpose:
  Calculates total employees represented
  in the chart.

  Fallback:
  Uses 1 to prevent chart rendering issues.
  ==========================================
  */
  const total = members.length || 1;

  /*
  ==========================================
  CHART DATA CONFIGURATION
  ------------------------------------------
  Purpose:
  Builds Chart.js dataset structure.

  Labels:
  Include both category names and counts.

  Dataset:
  Represents workforce distribution.
  ==========================================
  */
  const chartData = {
    labels: [
      `Office (${officeCount})`,
      `Remote (${remoteCount})`,
      `Hybrid (${hybridCount})`,
      `Other (${otherCount})`,
    ],

    datasets: [
      {
        data: [
          officeCount,
          remoteCount,
          hybridCount,
          otherCount,
        ],

        /*
        ======================================
        CHART COLORS
        --------------------------------------
        Blue   → Office
        Purple → Remote
        Green  → Hybrid
        Gray   → Other
        ======================================
        */
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(203, 213, 225, 0.7)",
        ],

        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(168, 85, 247)",
          "rgb(34, 197, 94)",
          "rgb(203, 213, 225)",
        ],

        borderWidth: 2,
      },
    ],
  };

  /*
  ==========================================
  CHART CONFIGURATION
  ------------------------------------------
  Purpose:
  Controls chart appearance and behavior.

  Features:
  - Responsive Design
  - Custom Tooltips
  - Styled Legend
  - Professional Dashboard Theme

  Business Logic:
  Improves readability and user experience.
  ==========================================
  */
  const chartOptions = {
    responsive: true,

    maintainAspectRatio: true,

    plugins: {

      /*
      ======================================
      LEGEND CONFIGURATION
      ======================================
      */
      legend: {
        position: "bottom",

        labels: {
          color: "rgb(161, 170, 180)",

          font: {
            size: 12,
            weight: 500,
          },

          padding: 15,
        },
      },

      /*
      ======================================
      TOOLTIP CONFIGURATION
      ======================================
      */
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    },
  };

  /*
  ==========================================
  WORK MODE ANALYTICS DASHBOARD
  ------------------------------------------
  Purpose:
  Displays workforce distribution chart.

  Sections:
  - Header
  - Doughnut Chart
  - Empty State

  Business Value:
  Enables quick understanding of workforce
  deployment across work environments.
  ==========================================
  */
  return (
    <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 text-white">

      {/* ======================================
          SECTION HEADER
      ====================================== */}
      <h3 className="text-lg font-semibold text-white mb-6">
        Work Mode Distribution
      </h3>

      {/* ======================================
          CHART CONTAINER
      ====================================== */}
      <div
        style={{
          maxHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        {/* ==================================
            CHART DISPLAY
        ================================== */}
        {total > 0 ? (

          <Doughnut
            data={chartData}
            options={chartOptions}
          />

        ) : (

          /*
          ==================================
          EMPTY STATE
          ----------------------------------
          Displayed when no workforce data
          is available.
          ==================================
          */
          <p className="text-zinc-400">
            No team members data available
          </p>

        )}

      </div>

    </div>
  );
};

export default WorkModeChart;