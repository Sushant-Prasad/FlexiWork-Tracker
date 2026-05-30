import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getTodayWorkLog,
  getMyWorkLogs,
} from "../../services/workLogServices.js";
import { FadeIn } from "../../components/motion/FadeIn.jsx";
import TodayWorkLogCard from "../../components/worklogs/TodayWorkLogCard.jsx";
import WorkLogStats from "../../components/worklogs/WorkLogStats.jsx";
import WorkHoursChart from "../../components/worklogs/WorkHoursChart.jsx";
import WorkModeChart from "../../components/worklogs/WorkModeChart.jsx";
import WorkLogHistoryTable from "../../components/worklogs/WorkLogHistoryTable.jsx";
import WorkLogCalendar from "../../components/worklogs/WorkLogCalendar.jsx";

/*
==================================================
MY WORK LOGS PAGE
--------------------------------------------------
API:
  GET /api/worklogs/today — today's log card
  GET /api/worklogs/me    — full history + stats

Purpose:
  Source of truth for employee attendance, worked
  hours, work mode, and productivity reporting.

Business Logic:
  All summary stats (totalLogs, averageHours,
  officeDays, remoteDays) are computed client-side
  from the work log list. No extra API needed.
==================================================
*/

const TOKEN_KEY = "flexiwork_token";

const computeStats = (logs) => {
  const valid = logs.filter(
    (l) => l.actualMode && l.actualMode !== "UNLOGGED"
  );
  const totalHours = valid.reduce((s, l) => s + Number(l.workedHours || 0), 0);
  return {
    totalLogs: logs.length,
    averageHours:
      valid.length > 0 ? (totalHours / valid.length).toFixed(1) : 0,
    officeDays: logs.filter((l) => l.actualMode === "OFFICE").length,
    remoteDays: logs.filter((l) => l.actualMode === "REMOTE").length,
  };
};

const MyWorkLogs = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  // ── Today's log ──────────────────────────────────────────────────
  const todayQuery = useQuery({
    queryKey: ["worklog-today"],
    queryFn: () => getTodayWorkLog(token),
    enabled: !!token,
  });

  // ── Full history ─────────────────────────────────────────────────
  const historyQuery = useQuery({
    queryKey: ["my-worklogs"],
    queryFn: () => getMyWorkLogs({ page: 1, limit: 100 }, token),
    enabled: !!token,
  });

  const todayLog = todayQuery.data?.data?.log || todayQuery.data?.data || {};
  const logs = useMemo(
    () => historyQuery.data?.data?.logs || historyQuery.data?.data || [],
    [historyQuery.data]
  );
  const stats = useMemo(() => computeStats(logs), [logs]);

  return (
    <section className="space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            My Work Logs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track daily check-ins, worked hours, and work mode history.
          </p>
        </div>
      </FadeIn>

      {/* ── Today's Work Log ─────────────────────────────────────────── */}
      <FadeIn delay={0.05}>
        <TodayWorkLogCard
          todayLog={todayLog}
          isLoading={todayQuery.isLoading}
        />
      </FadeIn>

      {/* ── Summary Stat Cards ────────────────────────────────────────── */}
      <FadeIn delay={0.1}>
        <WorkLogStats stats={stats} isLoading={historyQuery.isLoading} />
      </FadeIn>

      {/* ── Charts + Calendar Row ─────────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="grid gap-6 xl:grid-cols-[1fr_280px]">

          {/* Worked Hours Trend */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Worked Hours Trend
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Last 14 work log entries
              </p>
            </div>
            <WorkHoursChart logs={logs} isLoading={historyQuery.isLoading} />
          </div>

          {/* Calendar — compact right column */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Mode Calendar
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Color-coded daily view
              </p>
            </div>
            <WorkLogCalendar logs={logs} isLoading={historyQuery.isLoading} />
          </div>

        </div>
      </FadeIn>

      {/* ── Distribution + History ────────────────────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">

          {/* Work Mode Distribution */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-foreground">
                Work Mode Distribution
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Breakdown of your work modes
              </p>
            </div>
            <WorkModeChart logs={logs} isLoading={historyQuery.isLoading} />
          </div>

          {/* History Table */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Work Log History
              </h2>
              {!historyQuery.isLoading && (
                <span className="text-sm text-muted-foreground">
                  {logs.length} {logs.length === 1 ? "entry" : "entries"}
                </span>
              )}
            </div>
            <WorkLogHistoryTable
              logs={logs}
              isLoading={historyQuery.isLoading}
            />
          </div>

        </div>
      </FadeIn>

    </section>
  );
};

export default MyWorkLogs;
