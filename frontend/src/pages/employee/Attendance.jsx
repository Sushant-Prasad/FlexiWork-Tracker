import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarCheck,
  Flame,
  AlertTriangle,
  Building2,
  Wifi,
  Layers,
  Clock,
  LogIn,
  LogOut,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "../../components/ui/badge.jsx";
import AttendanceChart from "../../components/charts/AttendanceChart.jsx";
import {
  getAttendanceHistory,
  getAttendanceSummary,
  getTodayAttendance,
} from "../../services/attendanceServices.js";
import { FadeIn } from "../../components/motion/FadeIn.jsx";

/*
==================================================
EMPLOYEE ATTENDANCE PAGE
--------------------------------------------------
API:
  GET /api/attendance/summary  — monthly summary stats
  GET /api/attendance/today    — today's work log
  GET /api/attendance/history  — paginated log history

Purpose:
  Displays attendance stats, today's check-in panel,
  work mode distribution, a 7-day trend chart, and
  a full history table.
==================================================
*/

const TOKEN_KEY = "flexiwork_token";

const formatTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatMode = (mode) => {
  if (!mode || mode === "UNLOGGED") return "Unlogged";
  return mode
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (str) => {
  if (!str) return "—";
  return new Date(str + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ── Status badge config ──────────────────────────────────────────────
const getModeBadge = (mode) => {
  if (!mode || mode === "UNLOGGED")
    return { label: "Unlogged", variant: "outline" };
  if (mode === "OFFICE") return { label: "Office", variant: "default" };
  if (mode === "REMOTE") return { label: "Remote", variant: "secondary" };
  if (mode === "HYBRID") return { label: "Hybrid", variant: "secondary" };
  return { label: formatMode(mode), variant: "outline" };
};

const getStatusBadge = (mode) => {
  if (!mode || mode === "UNLOGGED")
    return { label: "Unlogged", variant: "outline" };
  return { label: "Logged", variant: "secondary" };
};

// ── Skeleton ─────────────────────────────────────────────────────────
const CardSkeleton = ({ count = 4, cols = 4 }) => (
  <div
    className={`grid gap-4 ${
      cols === 4
        ? "sm:grid-cols-2 xl:grid-cols-4"
        : cols === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2"
    }`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────────────────
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

  // ── Summary stat cards config ─────────────────────────────────────
  const summaryCards = [
    {
      label: "Attendance %",
      value: `${summary.attendancePercentage ?? 0}%`,
      icon: BarChart3,
    },
    {
      label: "Present Days",
      value: summary.presentDays ?? 0,
      icon: CalendarCheck,
    },
    {
      label: "Streak",
      value: `${summary.streak ?? 0} days`,
      icon: Flame,
    },
    {
      label: "Deviations",
      value: summary.deviations ?? 0,
      icon: AlertTriangle,
    },
  ];

  // ── Work mode cards config ────────────────────────────────────────
  const modeCards = [
    { label: "Office Days", value: summary.officeDays ?? 0, icon: Building2 },
    { label: "Remote Days", value: summary.remoteDays ?? 0, icon: Wifi },
    { label: "Hybrid Days", value: summary.hybridDays ?? 0, icon: Layers },
  ];

  // ── Chart data ────────────────────────────────────────────────────
  const trendData = useMemo(() => {
    const trendLogs = [...historyLogs].slice(0, 7).reverse();
    return {
      labels: trendLogs.map((log) => log.date?.slice(5) || ""),
      datasets: [
        {
          data: trendLogs.map((log) => Number(log.workedHours || 0)),
          borderColor: "#245BA7",
          backgroundColor: "rgba(36, 91, 167, 0.15)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#245BA7",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [historyLogs]);

  const modeBadge = getModeBadge(todayLog.actualMode);
  const isLoggedToday =
    todayLog.actualMode && todayLog.actualMode !== "UNLOGGED";

  return (
    <section className="space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            My Attendance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track attendance history, daily logs, and monthly performance.
          </p>
        </div>
      </FadeIn>

      {/* ── Summary Stat Cards ────────────────────────────────────────── */}
      <FadeIn delay={0.05}>
        {summaryQuery.isLoading ? (
          <CardSkeleton count={4} cols={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                      {label}
                    </p>
                    <p className="mt-3 text-4xl font-bold text-white">
                      {value}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-3">
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      {/* ── Today's Attendance + Work Mode ───────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Today's Panel */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Today's Attendance
              </h2>
              <Badge variant={modeBadge.variant}>{modeBadge.label}</Badge>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Check In */}
              <div className="flex items-center gap-4 rounded-2xl bg-secondary px-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LogIn size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Check In
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatTime(todayLog.checkInAt)}
                  </p>
                </div>
              </div>

              {/* Check Out */}
              <div className="flex items-center gap-4 rounded-2xl bg-secondary px-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LogOut size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Check Out
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatTime(todayLog.checkOutAt)}
                  </p>
                </div>
              </div>

              {/* Worked Hours */}
              <div className="flex items-center gap-4 rounded-2xl bg-secondary px-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Worked Hours
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {todayLog.workedHours ?? 0} hrs
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 rounded-2xl bg-secondary px-4 py-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isLoggedToday
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {isLoggedToday ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Status
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isLoggedToday ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {isLoggedToday ? "Logged" : "Not Logged"}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Work Mode Distribution */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Work Mode Distribution
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Breakdown of your work modes this month
              </p>
            </div>

            {summaryQuery.isLoading ? (
              <CardSkeleton count={3} cols={3} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {modeCards.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-3xl bg-primary p-5 shadow-[0_4px_12px_rgba(15,23,42,0.1)]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                      <Icon size={20} className="text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="mt-1 text-xs font-medium text-white/70">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </FadeIn>

      {/* ── Attendance Trend Chart ────────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Attendance Trend
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Worked hours over last 7 entries
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              Last 7 days
            </span>
          </div>
          <div className="h-64">
            <AttendanceChart data={trendData} />
          </div>
        </div>
      </FadeIn>

      {/* ── Attendance History Table ──────────────────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Attendance History
            </h2>
            {!historyQuery.isLoading && (
              <span className="text-sm text-muted-foreground">
                {historyLogs.length} entries
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Mode", "Check In", "Check Out", "Hours", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="pb-3 pr-6 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground last:pr-0"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historyQuery.isLoading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="py-4 pr-6">
                          <div className="h-4 animate-pulse rounded-full bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : historyLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No attendance history available.
                    </td>
                  </tr>
                ) : (
                  historyLogs.map((log) => {
                    const statusBadge = getStatusBadge(log.actualMode);
                    const modeBadgeRow = getModeBadge(log.actualMode);
                    return (
                      <tr
                        key={log._id || log.date}
                        className="transition hover:bg-muted/40"
                      >
                        <td className="py-4 pr-6 font-medium text-foreground">
                          {formatDate(log.date)}
                        </td>
                        <td className="py-4 pr-6">
                          <Badge variant={modeBadgeRow.variant}>
                            {modeBadgeRow.label}
                          </Badge>
                        </td>
                        <td className="py-4 pr-6 text-muted-foreground">
                          {formatTime(log.checkInAt)}
                        </td>
                        <td className="py-4 pr-6 text-muted-foreground">
                          {formatTime(log.checkOutAt)}
                        </td>
                        <td className="py-4 pr-6 text-muted-foreground">
                          {log.workedHours ?? 0} hrs
                        </td>
                        <td className="py-4">
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

    </section>
  );
};

export default EmployeeAttendance;
