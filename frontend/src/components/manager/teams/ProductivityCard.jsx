/*
==================================================
PRODUCTIVITY CARD COMPONENT
--------------------------------------------------
Components:
- ProductivityCard
- MetricCard

Purpose:
Displays team productivity analytics and
performance metrics for managers.

Used In:
Manager Teams Dashboard

Related API:
GET /api/teams/:id/productivity

Metrics Displayed:
- Tasks Completed
- Average Working Hours
- Pending Reviews

Business Value:
Provides managers with quick visibility
into team productivity, workload, and
performance trends.

Workflow:
1. Receive productivity analytics
2. Display KPI cards
3. Show performance summary
4. Render last refresh timestamp

Return:
Productivity analytics dashboard card.
==================================================
*/

import { CheckCircle2, Clock, Eye, TrendingUp } from "lucide-react";

/*
==================================================
METRIC CARD COMPONENT
--------------------------------------------------
Component:
MetricCard

Props:
- icon
- label
- value
- unit
- color

Purpose:
Reusable KPI card used to display
individual productivity metrics.

Supported Colors:
- blue
- emerald
- amber

Business Logic:
Provides a consistent design system
for productivity KPIs throughout
the application.

Return:
Single metric visualization card.
==================================================
*/
const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit = "",
  color = "blue",
}) => {

  /*
  ==========================================
  KPI COLOR CONFIGURATION
  ------------------------------------------
  Purpose:
  Defines visual styles for different
  metric categories.

  Usage:
  Blue    → General Metrics
  Emerald → Positive Performance
  Amber   → Attention Required
  ==========================================
  */
  const colorClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-200",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-200",
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-lg p-4 sm:p-6 backdrop-blur-sm`}
    >

      {/* ======================================
          CARD HEADER
      ====================================== */}
      <div className="flex items-center justify-between mb-2">

        {/* Metric Icon */}
        <div className="p-2 bg-white/5 rounded-md">

          <Icon
            size={18}
            className={`${
              colorClasses[color].includes("blue")
                ? "text-blue-200"
                : colorClasses[color].includes("emerald")
                ? "text-emerald-200"
                : "text-amber-200"
            }`}
          />

        </div>

      </div>

      {/* Metric Label */}
      <p className="text-xs text-white/70 font-medium mb-1">
        {label}
      </p>

      {/* Metric Value */}
      <div className="flex items-baseline">

        <p className="text-2xl sm:text-3xl font-bold text-white">
          {value}
        </p>

        {/* Optional Unit */}
        {unit && (
          <p className="text-xs sm:text-sm text-white/60 ml-2">
            {unit}
          </p>
        )}

      </div>

    </div>
  );
};

/*
==================================================
PRODUCTIVITY CARD
--------------------------------------------------
Component:
ProductivityCard

Props:
- productivity
- isLoading

Purpose:
Displays overall team productivity metrics.

Metrics:
- Tasks Completed
- Average Hours Worked
- Pending Reviews

Business Value:
Helps managers:
- Monitor team efficiency
- Track workload distribution
- Identify bottlenecks
- Measure workforce productivity

Return:
Team productivity analytics section.
==================================================
*/
const ProductivityCard = ({ productivity, isLoading }) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  productivity data is being loaded.

  Business Logic:
  Prevents layout shifts and improves
  perceived performance.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="rounded-xl p-6 sm:p-8 gradient-bg border border-white/10 animate-pulse text-white">

        {/* Header Skeleton */}
        <div className="h-8 bg-white/20 rounded w-1/3 mb-8"></div>

        {/* KPI Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white/10 rounded-lg"
            ></div>
          ))}

        </div>

        {/* Footer Skeleton */}
        <div className="mt-6 h-12 bg-white/10 rounded-lg w-1/2"></div>

      </div>
    );
  }

  /*
  ==========================================
  PRODUCTIVITY DATA EXTRACTION
  ------------------------------------------
  Purpose:
  Safely extracts productivity metrics.

  Fallback Values:
  Prevent UI crashes when data is missing.
  ==========================================
  */
  const tasksCompleted = productivity?.tasksCompleted || 0;
  const averageHours = productivity?.averageHours || 0;
  const pendingReviews = productivity?.pendingReviews || 0;

  /*
  ==========================================
  PRODUCTIVITY DASHBOARD
  ------------------------------------------
  Purpose:
  Displays team productivity KPIs and
  operational performance indicators.

  Features:
  - Productivity Overview
  - KPI Cards
  - Last Refresh Timestamp

  Business Value:
  Provides managers with actionable
  workforce insights.
  ==========================================
  */
  return (
    <div className="rounded-xl p-6 sm:p-8 gradient-bg border border-white/10 text-white">

      {/* ======================================
          SECTION HEADER
      ====================================== */}
      <div className="flex items-center justify-between mb-6">

        <div>

          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Team Productivity
          </h3>

          <p className="text-xs text-white/60 mt-1">
            Performance metrics overview
          </p>

        </div>

        {/* Analytics Icon */}
        <div className="p-2 bg-white/5 rounded-md">

          <TrendingUp
            size={22}
            className="text-blue-200"
          />

        </div>

      </div>

      {/* ======================================
          KPI METRICS GRID
      ====================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">

        {/* Tasks Completed */}
        <MetricCard
          icon={CheckCircle2}
          label="Tasks Completed"
          value={tasksCompleted}
          color="emerald"
        />

        {/* Average Working Hours */}
        <MetricCard
          icon={Clock}
          label="Average Hours"
          value={Math.round(averageHours)}
          unit="hrs"
          color="blue"
        />

        {/* Pending Reviews */}
        <MetricCard
          icon={Eye}
          label="Pending Reviews"
          value={pendingReviews}
          color="amber"
        />

      </div>

      {/* ======================================
          FOOTER INFORMATION
      ====================================== */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">

        <p className="text-xs text-white/70">

          <span className="font-semibold">
            Last updated:
          </span>

          {" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}

        </p>

      </div>

    </div>
  );
};

export default ProductivityCard;