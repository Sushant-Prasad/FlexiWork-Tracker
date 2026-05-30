import {
  CalendarCheck,
  CheckSquare,
  FileText,
  Flame,
} from "lucide-react";

/*
==================================================
PROFILE STATS
--------------------------------------------------
Purpose:
  Quick stat cards derived from data already loaded
  on other pages. Computed locally — no extra API.

Props:
  - attendanceData: from attendance summary query
  - tasksData: from tasks query
  - leavesData: from leaves query
  - worklogsData: from worklogs query
  - isLoading: boolean
==================================================
*/

const ProfileStats = ({
  attendanceData,
  tasksData,
  leavesData,
  worklogsData,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    );
  }

  // Derive stats from data
  const streak = attendanceData?.data?.streak ?? 0;

  const tasks = tasksData?.data || tasksData?.tasks || tasksData || [];
  const assignedTasks = Array.isArray(tasks) ? tasks.length : 0;

  const leaves = leavesData?.data || leavesData?.leaves || leavesData || [];
  const approvedLeaves = Array.isArray(leaves)
    ? leaves.filter((l) => l.status === "APPROVED").length
    : 0;

  const logs = worklogsData?.data?.logs || worklogsData?.data || worklogsData || [];
  const workLogs = Array.isArray(logs) ? logs.length : 0;

  const STATS = [
    {
      label: "Attendance Streak",
      value: `${streak} days`,
      icon: Flame,
    },
    {
      label: "Tasks Assigned",
      value: assignedTasks,
      icon: CheckSquare,
    },
    {
      label: "Approved Leaves",
      value: approvedLeaves,
      icon: CalendarCheck,
    },
    {
      label: "Work Logs",
      value: workLogs,
      icon: FileText,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                {label}
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Icon size={20} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
