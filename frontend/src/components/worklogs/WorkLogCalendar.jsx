import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
==================================================
WORK LOG CALENDAR
--------------------------------------------------
Purpose:
  Compact monthly calendar color-coding each day
  by work mode. Derived from work log list.

Props:
  - logs: array of work log objects
  - isLoading: boolean

Color key (theme-based):
  OFFICE  → bg-primary
  REMOTE  → bg-accent
  HYBRID  → bg-primary/40
  UNLOGGED → bg-destructive/20
==================================================
*/

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MODE_STYLE = {
  OFFICE: { cell: "bg-primary text-white", dot: "bg-primary" },
  REMOTE: { cell: "bg-accent text-white", dot: "bg-accent" },
  HYBRID: { cell: "bg-primary/40 text-white", dot: "bg-primary/40" },
  UNLOGGED: { cell: "bg-destructive/15 text-destructive", dot: "bg-destructive/40" },
};

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const LEGEND = [
  { mode: "OFFICE", label: "Office" },
  { mode: "REMOTE", label: "Remote" },
  { mode: "HYBRID", label: "Hybrid" },
  { mode: "UNLOGGED", label: "Absent" },
];

const WorkLogCalendar = ({ logs, isLoading }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Map date string → actualMode
  const logMap = useMemo(() => {
    const map = {};
    (logs || []).forEach((l) => { if (l.date) map[l.date] = l.actualMode; });
    return map;
  }, [logs]);

  // Calendar grid cells
  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const grid = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    // pad to complete last row
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const todayStr = today.toISOString().split("T")[0];

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-muted" />;
  }

  return (
    <div className="select-none">

      {/* ── Navigation ─────────────────────────────────────── */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted"
        >
          <ChevronLeft size={14} />
        </button>
        <p className="text-xs font-semibold text-foreground">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <button
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Day Labels ─────────────────────────────────────── */}
      <div className="mb-1 grid grid-cols-7">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-0.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* ── Day Cells ──────────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="h-7 w-7" />;

          const pad = String(viewMonth + 1).padStart(2, "0");
          const dateStr = `${viewYear}-${pad}-${String(day).padStart(2, "0")}`;
          const mode = logMap[dateStr];
          const style = mode ? MODE_STYLE[mode] : null;
          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              title={mode ? mode.toLowerCase() : undefined}
              className={`
                mx-auto flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-medium transition
                ${style ? style.cell : "text-foreground hover:bg-muted"}
                ${isToday && !style ? "ring-1 ring-primary ring-offset-1 font-bold" : ""}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3">
        {LEGEND.map(({ mode, label }) => (
          <div key={mode} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 shrink-0 rounded-sm ${MODE_STYLE[mode].dot}`} />
            <span className="text-[11px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkLogCalendar;
