import { ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";

/*
==================================================
LEAVE STATS
--------------------------------------------------
Purpose:
  Renders four summary cards showing leave counts
  by status: Total, Pending, Approved, Rejected.

Props:
  - stats: { total, pending, approved, rejected }
  - isLoading: boolean

Colors:
  Uses only CSS theme variables — no hardcoded
  Tailwind palette colors.
==================================================
*/

const STAT_CONFIG = [
  {
    key: "total",
    label: "Total Requests",
    icon: ClipboardList,
    iconBg: "bg-white/15",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    iconBg: "bg-white/20",
  },
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    iconBg: "bg-white/20",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    iconBg: "bg-white/20",
  },
];

const LeaveStatSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-28 animate-pulse rounded-3xl bg-muted" />
    ))}
  </div>
);

const LeaveStats = ({ stats, isLoading }) => {
  if (isLoading) return <LeaveStatSkeleton />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, iconBg }) => (
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
                {stats[key] ?? 0}
              </p>
            </div>
            <div className={`rounded-2xl p-3 ${iconBg}`}>
              <Icon size={22} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveStats;
