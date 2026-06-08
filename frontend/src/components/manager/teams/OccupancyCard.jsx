/*
==================================================
OFFICE OCCUPANCY CARD
--------------------------------------------------
Component:
OccupancyCard

Props:
- occupancy
- isLoading

Purpose:
Displays office capacity utilization and
workspace occupancy metrics for the
selected team.

Used In:
Manager Teams Dashboard

Related API:
GET /api/teams/:id/occupancy

Metrics Displayed:
- Occupied Seats
- Available Seats
- Total Capacity
- Occupancy Percentage

Business Value:
Provides managers with real-time visibility
into office space utilization and supports
hybrid workforce planning.

Workflow:
1. Receive occupancy analytics
2. Calculate capacity usage
3. Render utilization progress bar
4. Display occupancy statistics

Return:
Office occupancy analytics card.
==================================================
*/

import { Building2 } from "lucide-react";

const OccupancyCard = ({ occupancy, isLoading }) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  occupancy data is loading.

  Business Logic:
  Prevents layout shifts and provides
  visual feedback during API requests.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 animate-pulse text-white">

        {/* Card Title Skeleton */}
        <div className="h-6 bg-white/20 rounded w-1/3 mb-6"></div>

        {/* Metrics Skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded"></div>
          <div className="h-8 bg-white/20 rounded w-1/2"></div>
        </div>

      </div>
    );
  }

  /*
  ==========================================
  OCCUPANCY DATA EXTRACTION
  ------------------------------------------
  Purpose:
  Safely extracts occupancy metrics from
  API response.

  Fallback Values:
  Applied to prevent UI crashes when
  data is unavailable.
  ==========================================
  */
  const capacity = occupancy?.capacity || 1;
  const occupied = occupancy?.occupied || 0;
  const available = occupancy?.available || 0;
  const percentage = occupancy?.occupancyPercentage || 0;

  /*
  ==========================================
  OCCUPANCY DASHBOARD CARD
  ------------------------------------------
  Purpose:
  Displays office utilization analytics.

  Features:
  - Capacity usage progress bar
  - Occupied seat count
  - Available seat count
  - Total office capacity

  Business Value:
  Helps managers understand:
  - Workspace utilization
  - Capacity constraints
  - Hybrid work planning
  ==========================================
  */
  return (
    <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 text-white">

      {/* ======================================
          CARD HEADER
      ====================================== */}
      <div className="flex items-center justify-between mb-6">

        <h3 className="text-lg font-semibold text-white">
          Office Occupancy
        </h3>

        <Building2
          size={24}
          className="text-white"
        />

      </div>

      <div className="space-y-4">

        {/* ======================================
            OCCUPANCY UTILIZATION BAR
        ====================================== */}
        <div className="space-y-2">

          {/* Usage Summary */}
          <div className="flex justify-between items-center">

            <span className="text-sm text-white/80">
              Capacity Usage
            </span>

            <span className="text-sm font-semibold text-white">
              {percentage}%
            </span>

          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

            {/* ==================================
                DYNAMIC UTILIZATION BAR

                Green  : Healthy Usage
                Yellow : Moderate Usage
                Red    : High Occupancy
            ================================== */}
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percentage > 80
                  ? "bg-red-500"
                  : percentage > 50
                  ? "bg-yellow-500"
                  : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(percentage, 100)}%`,
              }}
            ></div>

          </div>

        </div>

        {/* ======================================
            OCCUPANCY STATISTICS
        ====================================== */}
        <div className="grid grid-cols-3 gap-4 pt-4">

          {/* Occupied Seats */}
          <div className="text-center">

            <p className="text-2xl font-bold text-white">
              {occupied}
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              Occupied
            </p>

          </div>

          {/* Available Seats */}
          <div className="text-center">

            <p className="text-2xl font-bold text-white">
              {available}
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              Available
            </p>

          </div>

          {/* Total Capacity */}
          <div className="text-center">

            <p className="text-2xl font-bold text-white">
              {capacity}
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              Total
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OccupancyCard;