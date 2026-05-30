import { CalendarCheck, Clock } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
UPCOMING LEAVES
--------------------------------------------------
Purpose:
  Shows approved future leave requests so the
  employee can see what's coming up.

Props:
  - leaves: array of leave objects (all leaves)
  - isLoading: boolean

Colors:
  Uses only CSS theme variables — no hardcoded
  Tailwind palette colors.
==================================================
*/

const TYPE_LABELS = {
  PTO: "Paid Time Off",
  SICK: "Sick Leave",
  WFH: "Work From Home",
};

const formatDateRange = (start, end) => {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts = { day: "numeric", month: "short" };

  if (start === end) {
    return s.toLocaleDateString("en-IN", { ...opts, year: "numeric" });
  }

  const sameYear = s.getFullYear() === e.getFullYear();
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", {
    ...opts,
    year: sameYear ? undefined : "numeric",
  })} ${e.getFullYear()}`;
};

const getDayCount = (start, end) => {
  const diff =
    (new Date(end + "T00:00:00") - new Date(start + "T00:00:00")) /
    (1000 * 60 * 60 * 24);
  return diff + 1;
};

const UpcomingLeavesSkeleton = () => (
  <div className="space-y-3">
    {[1, 2].map((i) => (
      <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
    ))}
  </div>
);

const UpcomingLeaves = ({ leaves, isLoading }) => {
  if (isLoading) return <UpcomingLeavesSkeleton />;

  const todayStr = new Date().toISOString().split("T")[0];

  const upcoming = leaves
    .filter((l) => l.status === "APPROVED" && l.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 py-10 text-center">
        <CalendarCheck size={36} className="text-muted-foreground/50" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          No upcoming approved leaves
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcoming.map((leave) => {
        const days = getDayCount(leave.startDate, leave.endDate);

        return (
          <div
            key={leave._id}
            className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4 transition hover:bg-muted/40"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <CalendarCheck size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {TYPE_LABELS[leave.type] || leave.type}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {formatDateRange(leave.startDate, leave.endDate)}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col items-end gap-1.5">
              <Badge variant="secondary">{leave.type}</Badge>
              <span className="text-xs text-muted-foreground">
                {days} {days === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingLeaves;
