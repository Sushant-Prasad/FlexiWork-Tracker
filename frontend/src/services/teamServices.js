import axios from "axios";

/*
==================================================
TEAM SERVICE LAYER
--------------------------------------------------
Purpose:
Centralized API client for Team features in the
frontend. Keeps networking logic out of UI.

Why It Exists:
Provides a single, consistent place to call the
backend and normalize errors.

Where It Is Used:
- Admin screens (team setup and management)
- Manager screens (team membership updates)
==================================================
*/

/*
==================================================
AXIOS INSTANCE
--------------------------------------------------
Purpose:
Shared API client for all Team endpoints.

Workflow:
1) Resolve base URL from VITE_API_URL.
2) Reuse the instance across all calls.

Where It Is Used:
Every Team service method below.
==================================================
*/
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:3002/api",
});

/*
==================================================
ERROR HANDLER
--------------------------------------------------
Purpose:
Extracts backend error messages in a safe,
user-friendly way.

Workflow:
1) Read error.response.data.message if present.
2) Fallback to a custom message.

Return Value:
String message for UI to display.
==================================================
*/
const getErrorMessage = (
  error,
  fallbackMessage
) => {
  return (
    error?.response?.data?.message ||
    fallbackMessage
  );
};

/*
==================================================
AUTH HEADER HELPER
--------------------------------------------------
Purpose:
Builds the Authorization header for protected
Team routes.

Workflow:
1) Accept a JWT token.
2) Return headers object for axios.

Return Value:
Axios config with Bearer token attached.
==================================================
*/
const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/*
==================================================
CREATE TEAM
--------------------------------------------------
API:
POST /api/teams

Access:
SYSTEM_ADMIN only

Purpose:
Creates a new team with a manager and optional
members.

Workflow:
1) Send create payload to backend.
2) Backend validates manager and members.
3) Returns created team object.

Payload Structure:
{
  name: string,
  managerId: string,
  members?: string[],
  site?: string,
  officeCapacity?: number
}

Return Value:
{ team }

Important Business Logic:
Members cannot already belong to another team.
==================================================
*/
export const createTeam = async (
  payload,
  token
) => {
  try {

    const response = await api.post(
      "/teams",
      payload,
      withAuth(token)
    );

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Failed to create team"
      )
    );

  }
};

/*
==================================================
GET ALL TEAMS
--------------------------------------------------
API:
GET /api/teams

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Fetch the list of teams.

Workflow:
1) Request team list.
2) Backend filters by manager for MANAGER role.

Return Value:
{ teams: Team[] }

Important Business Logic:
Managers only see their own teams.
==================================================
*/
export const listTeams = async (
  token
) => {
  try {

    const response = await api.get(
      "/teams",
      withAuth(token)
    );

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch teams"
      )
    );

  }
};

/*
==================================================
GET SINGLE TEAM
--------------------------------------------------
API:
GET /api/teams/:id

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Fetch detailed information for one team.

Workflow:
1) Request team by id.
2) Backend checks manager ownership if needed.

Return Value:
{ team }

Important Business Logic:
Managers can only access teams they manage.
==================================================
*/
export const getTeamById = async (
  teamId,
  token
) => {
  try {

    const response = await api.get(
      `/teams/${teamId}`,
      withAuth(token)
    );

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch team"
      )
    );

  }
};

/*
==================================================
UPDATE TEAM
--------------------------------------------------
API:
PUT /api/teams/:id

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Update team details like name or capacity.

Workflow:
1) Send update payload.
2) Backend verifies permissions.

Payload Structure:
{
  name?: string,
  managerId?: string,
  site?: string,
  officeCapacity?: number
}

Return Value:
{ team }

Important Business Logic:
Only SYSTEM_ADMIN can change managerId.
==================================================
*/
export const updateTeam = async (
  teamId,
  payload,
  token
) => {
  try {

    const response = await api.put(
      `/teams/${teamId}`,
      payload,
      withAuth(token)
    );

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Failed to update team"
      )
    );

  }
};

/*
==================================================
ADD TEAM MEMBERS
--------------------------------------------------
API:
POST /api/teams/:id/members

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Adds one or more members to a team.

Workflow:
1) Send memberIds or userId.
2) Backend validates membership rules.

Payload Structure:
{
  memberIds?: string[],
  userId?: string
}

Return Value:
{ team }

Important Business Logic:
Users cannot be assigned to multiple teams.
==================================================
*/
export const addTeamMembers = async (
  teamId,
  payload,
  token
) => {
  try {

    const response = await api.post(
      `/teams/${teamId}/members`,
      payload,
      withAuth(token)
    );

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Failed to add team members"
      )
    );

  }
};

/*
==================================================
REMOVE TEAM MEMBER
--------------------------------------------------
API:
DELETE /api/teams/:id/members/:userId

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Removes a member from a team.

Workflow:
1) Request removal by teamId and userId.
2) Backend updates team and user references.

Return Value:
{ team }

Important Business Logic:
Team manager cannot be removed from their team.
==================================================
*/
export const removeTeamMember = async (
  teamId,
  userId,
  token
) => {
  try {

    const response = await api.delete(
      `/teams/${teamId}/members/${userId}`,
      withAuth(token)
    );

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Failed to remove team member"
      )
    );

  }
};

/*
==================================================
GET MY TEAM
--------------------------------------------------
API:
GET /api/teams/my-team

Access:
Any authenticated user

Purpose:
Fetch the user's own team (if they have a teamId).
Used by team members to view their team info.

Return Value:
{ team }
==================================================
*/
export const getMyTeam = async (token) => {
  try {
    const response = await api.get(
      "/teams/my-team",
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch your team"
      )
    );
  }
};

/*
==================================================
GET TEAM OVERVIEW
--------------------------------------------------
API:
GET /api/teams/:id/overview

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Get team overview metrics for dashboard.

Return Value:
{
  teamName: string,
  memberCount: number,
  officeToday: number,
  remoteToday: number,
  hybridToday: number,
  unlogged: number,
  officeCapacity: number,
  manager: { _id, name, email },
  site: string
}
==================================================
*/
export const getTeamOverview = async (
  teamId,
  token
) => {
  try {
    const response = await api.get(
      `/teams/${teamId}/overview`,
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch team overview"
      )
    );
  }
};

/*
==================================================
GET TEAM OCCUPANCY
--------------------------------------------------
API:
GET /api/teams/:id/occupancy

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Get office occupancy data for the team.

Return Value:
{
  capacity: number,
  occupied: number,
  available: number,
  occupancyPercentage: number
}
==================================================
*/
export const getTeamOccupancy = async (
  teamId,
  token
) => {
  try {
    const response = await api.get(
      `/teams/${teamId}/occupancy`,
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch occupancy"
      )
    );
  }
};

/*
==================================================
GET TEAM PRODUCTIVITY
--------------------------------------------------
API:
GET /api/teams/:id/productivity

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Get team productivity metrics.

Return Value:
{
  tasksCompleted: number,
  averageHours: number,
  pendingReviews: number
}
==================================================
*/
export const getTeamProductivity = async (
  teamId,
  token
) => {
  try {
    const response = await api.get(
      `/teams/${teamId}/productivity`,
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch productivity"
      )
    );
  }
};

/*
==================================================
GET TEAM DAILY SNAPSHOT
--------------------------------------------------
API:
GET /api/teams/:id/daily-snapshot

Access:
SYSTEM_ADMIN, MANAGER

Purpose:
Get team daily snapshot with member details.

Return Value:
{
  date: string,
  teamName: string,
  members: [{
    employee: string,
    role: string,
    plannedMode: string,
    actualMode: string,
    attendanceStatus: string,
    workedHours: number
  }]
}
==================================================
*/
export const getTeamDailySnapshot = async (
  teamId,
  token
) => {
  try {
    const response = await api.get(
      `/teams/${teamId}/daily-snapshot`,
      withAuth(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        "Failed to fetch team snapshot"
      )
    );
  }
};