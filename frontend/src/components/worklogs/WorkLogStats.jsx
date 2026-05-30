import { ScrollText, Timer, Building2, Wifi } from "lucide-react";

/*
==================================================
WORK LOG STATS
--------------------------------------------------
Purpose:
  Renders 4 summary stat cards computed from the
  full work log list — no extra API needed.

Props:
  - stats: { totalLogs, averageHours, officeDays, remoteDays }
  - isLoading: boolean
==================================================
*/

const STAT_CONFIG = [
  { key: "totalLogs", label: "Total Logs", icon: ScrollText },
  { key: "averageHours", label: "Avg Hours/Day", icon: Timer },
  { key: "officeDays", label: "Office Days", icon: Building2 },
  { key: "remoteDays", label: "Remote Days", icon: Wifi },
];

const WorkLogStats = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="rounded-3xl bg-primary p-6 shadow-[0_8px_24px_rgba(15,23,42,0.12)] card-hover"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/75">
                {label}
              </p>
              <p className="mt-3 text-4xl font-bold text-white">
                {stats?.[key] ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-3">
              <Icon size={22} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkLogStats;
