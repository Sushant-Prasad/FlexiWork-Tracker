/*
==================================================
TEAM INFORMATION CARD
--------------------------------------------------
Component:
TeamInfoCard

Helper Function:
getManagerName()

Props:
- overview
- team
- isLoading

Purpose:
Displays essential information about the
selected team in a structured and
manager-friendly format.

Used In:
Manager Teams Dashboard

Related APIs:
GET /api/teams/:id/overview
GET /api/teams
GET /api/teams/my-team

Information Displayed:
- Team Name
- Manager Name
- Member Count
- Office Capacity
- Site Location

Business Value:
Provides managers with a quick overview
of team ownership, workforce size,
workspace allocation, and office location.

Workflow:
1. Receive team data
2. Extract key team attributes
3. Format information for display
4. Render management summary card

Return:
Team information dashboard card.
==================================================
*/

import { Building2, User, Users } from "lucide-react";

/*
==================================================
MANAGER NAME RESOLVER
--------------------------------------------------
Function:
getManagerName()

Parameters:
- overview
- team

Purpose:
Safely extracts the manager name from
multiple possible API response structures.

Workflow:
1. Check overview.manager
2. Check team.managerId
3. Check team.manager
4. Return manager name

Fallback:
Returns "N/A" when manager information
is unavailable.

Business Logic:
Different API endpoints may return manager
data in different formats. This helper
normalizes the response.
==================================================
*/
const getManagerName = (overview, team) => {

  const manager =
    overview?.manager ||
    team?.managerId ||
    team?.manager;

  /*
  ==========================================
  HANDLE STRING IDS
  ------------------------------------------
  Some APIs may return only the manager id
  instead of a populated user object.

  Example:
  "684f4c3ab8f4f1c..."

  In such cases display "N/A".
  ==========================================
  */
  if (typeof manager === "string") {
    return "N/A";
  }

  return manager?.name || "N/A";
};

/*
==================================================
TEAM INFORMATION CARD
--------------------------------------------------
Component:
TeamInfoCard

Purpose:
Displays a summary of team metadata and
organizational details.

Features:
- Team Overview
- Manager Information
- Workforce Size
- Office Capacity
- Site Information

Business Value:
Provides managers with immediate visibility
into the operational structure of the team.
==================================================
*/
const TeamInfoCard = ({
  overview,
  team,
  isLoading,
}) => {

  /*
  ==========================================
  LOADING STATE
  ------------------------------------------
  Purpose:
  Displays skeleton placeholders while
  team information is loading.

  Business Logic:
  Prevents layout shifts and improves
  perceived application performance.
  ==========================================
  */
  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 border border-white/10 mb-8 animate-pulse">

        {/* Card Title Skeleton */}
        <div className="h-6 bg-white/20 rounded w-1/4 mb-6"></div>

        {/* Information Row Skeletons */}
        <div className="space-y-4">

          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between"
            >

              <div className="h-4 bg-white/10 rounded w-1/4"></div>

              <div className="h-4 bg-white/20 rounded w-1/3"></div>

            </div>
          ))}

        </div>

      </div>
    );
  }

  /*
  ==========================================
  TEAM METRICS EXTRACTION
  ------------------------------------------
  Purpose:
  Safely extracts team statistics from
  overview or team response objects.

  Fallback Strategy:
  Uses team data if overview data
  is unavailable.
  ==========================================
  */
  const memberCount =
    overview?.memberCount ??
    team?.members?.length ??
    0;

  const officeCapacity =
    overview?.officeCapacity ??
    team?.officeCapacity ??
    0;

  /*
  ==========================================
  TEAM INFORMATION CONFIGURATION
  ------------------------------------------
  Purpose:
  Defines all information rows displayed
  inside the card.

  Business Logic:
  Centralizes display configuration and
  simplifies rendering.
  ==========================================
  */
  const info = [
    {
      label: "Team Name",
      value: overview?.teamName || team?.name || "N/A",
      icon: Users,
    },
    {
      label: "Manager",
      value: getManagerName(overview, team),
      icon: User,
    },
    {
      label: "Members",
      value: memberCount,
      icon: Users,
    },
    {
      label: "Office Capacity",
      value: `${officeCapacity} seats`,
      icon: Building2,
    },
    {
      label: "Site Location",
      value: overview?.site || team?.site || "Not specified",
      icon: Building2,
    },
  ];

  /*
  ==========================================
  TEAM INFORMATION DASHBOARD
  ------------------------------------------
  Purpose:
  Displays organizational and operational
  details about the selected team.

  Sections:
  - Header
  - Information Rows

  Business Value:
  Gives managers quick access to critical
  team metadata.
  ==========================================
  */
  return (
    <div className="rounded-lg p-6 bg-prime border border-primary/20 mb-8 text-white">

      {/* ======================================
          SECTION HEADER
      ====================================== */}
      <h3 className="text-lg font-semibold text-white mb-6">
        Team Information
      </h3>

      {/* ======================================
          INFORMATION LIST
      ====================================== */}
      <div className="space-y-4">

        {info.map((item, idx) => {

          const Icon = item.icon;

          return (
            <div
              key={idx}
              className="flex items-center justify-between pb-4 border-b border-white/5 last:border-b-0"
            >

              {/* ==================================
                  LABEL SECTION
              ================================== */}
              <div className="flex items-center gap-3">

                <Icon
                  size={18}
                  className="text-white/80"
                />

                <span className="text-sm text-white/80">
                  {item.label}
                </span>

              </div>

              {/* ==================================
                  VALUE SECTION
              ================================== */}
              <span className="max-w-[55%] truncate text-right font-medium text-white">
                {item.value}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default TeamInfoCard;