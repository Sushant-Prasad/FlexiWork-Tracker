import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AttendanceChart from "../../components/charts/AttendanceChart.jsx";
import {
  getAttendanceHistory,
  getAttendanceSummary,
  getTodayAttendance,
} from "../../services/attendanceServices.js";

const TOKEN_KEY = "flexiwork_token";

const formatTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatMode = (mode) => {
  if (!mode) return "Unlogged";
  return mode.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const EmployeeAttendance = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  const summaryQuery = useQuery({
    queryKey: ["attendance-summary"],
    queryFn: () => getAttendanceSummary(token),
    enabled: !!token,
  });

  const todayQuery = useQuery({
    queryKey: ["attendance-today"],
    queryFn: () => getTodayAttendance(token),
    enabled: !!token,
  });

  const historyQuery = useQuery({
    queryKey: ["attendance-history"],
    queryFn: () => getAttendanceHistory({ page: 1, limit: 10 }, token),
    enabled: !!token,
  });

  const summary = summaryQuery.data?.data || {};
  const todayLog = todayQuery.data?.data?.log || {};
  const historyLogs = historyQuery.data?.data?.logs || [];

  const trendData = useMemo(() => {
    const trendLogs = [...historyLogs].slice(0, 7).reverse();
    return {
      labels: trendLogs.map((log) => log.date?.slice(5) || ""),
      datasets: [
        {
          data: trendLogs.map((log) => Number(log.workedHours || 0)),
          borderColor: "#245BA7",
          backgroundColor: "rgba(36, 91, 167, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [historyLogs]);

  const summaryCards = [
    { label: "Attendance %", value: `${summary.attendancePercentage ?? 0}%` },
    { label: "Present Days", value: summary.presentDays ?? 0 },
    { label: "Attendance Streak", value: `${summary.streak ?? 0} Days` },
    { label: "Deviations", value: summary.deviations ?? 0 },
  ];

  const modeCards = [
    { label: "Office Days", value: summary.officeDays ?? 0 },
    { label: "Remote Days", value: summary.remoteDays ?? 0 },
    { label: "Hybrid Days", value: summary.hybridDays ?? 0 },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Attendance</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track attendance history, daily logs, and monthly performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-semibold text-foreground">Today's Attendance</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mode</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {formatMode(todayLog.actualMode)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Worked Hours</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {todayLog.workedHours ?? 0} hrs
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Check In</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {formatTime(todayLog.checkInAt)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Check Out</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {formatTime(todayLog.checkOutAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-semibold text-foreground">Work Mode Distribution</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {modeCards.map((item) => (
              <div key={item.label} className="rounded-xl bg-secondary px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Attendance Trend</h2>
          <span className="text-sm text-muted-foreground">Last 7 entries</span>
        </div>
        <div className="mt-4 h-64">
          <AttendanceChart data={trendData} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Attendance History</h2>
          {historyQuery.isLoading ? (
            <span className="text-sm text-muted-foreground">Loading...</span>
          ) : null}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Mode</th>
                <th className="pb-3">Check In</th>
                <th className="pb-3">Check Out</th>
                <th className="pb-3">Hours</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historyLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No attendance history available.
                  </td>
                </tr>
              ) : (
                historyLogs.map((log) => (
                  <tr key={log._id || log.date} className="text-foreground">
                    <td className="py-4">{log.date}</td>
                    <td className="py-4">{formatMode(log.actualMode)}</td>
                    <td className="py-4">{formatTime(log.checkInAt)}</td>
                    <td className="py-4">{formatTime(log.checkOutAt)}</td>
                    <td className="py-4">{log.workedHours ?? 0} hrs</td>
                    <td className="py-4">
                      {log.actualMode === "UNLOGGED" ? "Unlogged" : "Logged"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EmployeeAttendance;
