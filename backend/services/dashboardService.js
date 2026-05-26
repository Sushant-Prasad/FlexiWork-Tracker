import DailySnapshot from "../models/DailySnapshot.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import LeaveRequest from "../models/LeaveRequest.js";

export const getOverviewData = async (user) => {
  const latestSnapshot = await DailySnapshot.findOne().sort({ date: -1 });

  const totalEmployees = await User.countDocuments({ role: "EMPLOYEE" });
  const pendingLeaves = await LeaveRequest.countDocuments({ status: "PENDING" });
  const completedTasks = await Task.countDocuments({ status: "DONE" });

  return {
    totalEmployees,
    officeCount: latestSnapshot?.officeCount || 0,
    remoteCount: latestSnapshot?.remoteCount || 0,
    hybridCount: latestSnapshot?.hybridCount || 0,
    unloggedCount: latestSnapshot?.unloggedCount || 0,
    adherencePercent: latestSnapshot?.metadata?.adherencePct || 0,
    pendingLeaves,
    completedTasks,
  };
};

export const getHeatmapData = async () => {
  const snapshots = await DailySnapshot.find().sort({ date: 1 }).limit(30);

  return snapshots.map((item) => ({
    date: item.date,
    officeCount: item.officeCount,
    remoteCount: item.remoteCount,
    hybridCount: item.hybridCount,
    adherencePercent: item.metadata?.adherencePct || 0,
  }));
};
