import DailySnapshot from "../models/DailySnapshot.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Team from "../models/Team.js";
import WorkLog from "../models/WorkLog.js";
import { getTodayDate } from "../utils/dateUtils.js";

const buildDateRangeFilter = (startDate, endDate) => {
  if (!startDate && !endDate) return null;
  const range = {};
  if (startDate) range.$gte = startDate;
  if (endDate) range.$lte = endDate;
  return range;
};

const formatDate = (date) => date.toISOString().slice(0, 10);

const getSnapshotAggregate = async ({ teamIds, startDate, endDate }) => {
  const query = {};
  if (teamIds && teamIds.length > 0) {
    query.teamId = { $in: teamIds };
  } else {
    query.teamId = null;
  }

  const dateRange = buildDateRangeFilter(startDate, endDate);
  if (dateRange) {
    query.date = dateRange;
  }

  let snapshots = [];

  if (dateRange) {
    snapshots = await DailySnapshot.find(query);
  } else {
    const latest = await DailySnapshot.findOne(query).sort({ date: -1 }).select("date");
    if (!latest) return null;
    snapshots = await DailySnapshot.find({ ...query, date: latest.date });
  }

  if (snapshots.length === 0) return null;

  const totals = snapshots.reduce(
    (acc, item) => {
      acc.totalPlanned += item.totalPlanned || 0;
      acc.matchedCount += item.matchedCount || 0;
      acc.officeCount += item.officeCount || 0;
      acc.remoteCount += item.remoteCount || 0;
      acc.hybridCount += item.hybridCount || 0;
      acc.unloggedCount += item.unloggedCount || 0;
      return acc;
    },
    {
      totalPlanned: 0,
      matchedCount: 0,
      officeCount: 0,
      remoteCount: 0,
      hybridCount: 0,
      unloggedCount: 0,
    }
  );

  const adherencePercent = totals.totalPlanned
    ? (totals.matchedCount / totals.totalPlanned) * 100
    : 0;

  return {
    officeCount: totals.officeCount,
    remoteCount: totals.remoteCount,
    hybridCount: totals.hybridCount,
    unloggedCount: totals.unloggedCount,
    adherencePercent,
  };
};

const getEmployeeStreak = async (userId, today) => {
  const recentLogs = await WorkLog.find({
    userId,
    actualMode: { $ne: "UNLOGGED" },
  })
    .select("date")
    .sort({ date: -1 })
    .limit(30);

  const loggedDates = new Set(recentLogs.map((log) => log.date));
  let streak = 0;
  let cursor = new Date(`${today}T00:00:00Z`);

  while (loggedDates.has(formatDate(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

const getEmployeeOverview = async (user) => {
  const today = getTodayDate();
  const todayLog = await WorkLog.findOne({ userId: user._id, date: today });
  const pendingTasks = await Task.countDocuments({
    assignedTo: user._id,
    status: { $ne: "DONE" },
  });
  const attendanceStreak = await getEmployeeStreak(user._id, today);

  return {
    todayWorkMode: todayLog?.actualMode || "UNLOGGED",
    workedHours: todayLog?.workedHours || 0,
    assignedTasks: pendingTasks,
    attendanceStreak,
  };
};

const getManagerOverview = async (user, options) => {
  const teams = await Team.find({ managerId: user._id }).select("_id name members");
  const teamIds = teams.map((team) => team._id);
  const memberIds = Array.from(
    new Set(teams.flatMap((team) => team.members || []).map(String))
  );

  const pendingLeaves = memberIds.length
    ? await LeaveRequest.countDocuments({
        status: "PENDING",
        userId: { $in: memberIds },
      })
    : 0;

  if (teamIds.length === 0) {
    return {
      teamCount: 0,
      officeCount: 0,
      remoteCount: 0,
      hybridCount: 0,
      unloggedCount: 0,
      adherencePercent: 0,
      pendingLeaves,
    };
  }

  const teamIdSet = new Set(teamIds.map(String));
  const requestedTeamId =
    options?.teamId && teamIdSet.has(String(options.teamId))
      ? options.teamId
      : null;

  const scopedTeamIds = requestedTeamId ? [requestedTeamId] : teamIds;
  let snapshot = await getSnapshotAggregate({
    teamIds: scopedTeamIds,
    startDate: options?.startDate,
    endDate: options?.endDate,
  });

  if (!snapshot) {
    snapshot = await getSnapshotAggregate({
      teamIds: null,
      startDate: options?.startDate,
      endDate: options?.endDate,
    });
  }

  return {
    teamCount: teams.length,
    officeCount: snapshot?.officeCount || 0,
    remoteCount: snapshot?.remoteCount || 0,
    hybridCount: snapshot?.hybridCount || 0,
    unloggedCount: snapshot?.unloggedCount || 0,
    adherencePercent: snapshot?.adherencePercent || 0,
    pendingLeaves,
  };
};

const getAdminOverview = async (options) => {
  const snapshot = await getSnapshotAggregate({
    teamIds: options?.teamId ? [options.teamId] : null,
    startDate: options?.startDate,
    endDate: options?.endDate,
  });

  const totalEmployees = await User.countDocuments({ role: "EMPLOYEE" });
  const pendingLeaves = await LeaveRequest.countDocuments({ status: "PENDING" });
  const completedTasks = await Task.countDocuments({ status: "DONE" });

  return {
    totalEmployees,
    officeCount: snapshot?.officeCount || 0,
    remoteCount: snapshot?.remoteCount || 0,
    hybridCount: snapshot?.hybridCount || 0,
    unloggedCount: snapshot?.unloggedCount || 0,
    adherencePercent: snapshot?.adherencePercent || 0,
    pendingLeaves,
    completedTasks,
  };
};

export const getOverviewData = async (user, options = {}) => {
  if (!user?.role) {
    throw new Error("User role is required for dashboard overview");
  }

  if (user.role === "EMPLOYEE") {
    return getEmployeeOverview(user);
  }

  if (user.role === "MANAGER") {
    return getManagerOverview(user, options);
  }

  return getAdminOverview(options);
};

export const getEmployeeDashboardData = async (user) => {
  const overview = await getEmployeeOverview(user);

  return {
    todayMode: overview.todayWorkMode,
    workedHours: overview.workedHours,
    attendanceStreak: overview.attendanceStreak,
    assignedTasks: overview.assignedTasks,
  };
};

export const getManagerDashboardData = async (user, options = {}) => {
  const overview = await getManagerOverview(user, options);

  return {
    teamAdherence: overview.adherencePercent,
    missingLogs: overview.unloggedCount,
    officeOccupancy: overview.officeCount,
    pendingLeaves: overview.pendingLeaves,
  };
};

export const getAdminDashboardData = async (options = {}) => {
  const overview = await getAdminOverview(options);
  const activeTeams = await Team.countDocuments();

  return {
    totalEmployees: overview.totalEmployees,
    activeTeams,
    overallProductivity: overview.adherencePercent,
    officeCount: overview.officeCount,
  };
};

export const getHeatmapData = async (options = {}) => {
  const query = {};
  if (options.teamId) {
    query.teamId = options.teamId;
  } else {
    query.teamId = null;
  }

  const dateRange = buildDateRangeFilter(options.startDate, options.endDate);
  if (dateRange) query.date = dateRange;

  const snapshots = await DailySnapshot.find(query)
    .sort({ date: 1 })
    .limit(dateRange ? 365 : 30);

  return snapshots.map((item) => ({
    date: item.date,
    officeCount: item.officeCount,
    remoteCount: item.remoteCount,
    hybridCount: item.hybridCount,
    adherencePercent: item.metadata?.adherencePct || 0,
  }));
};
