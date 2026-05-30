import { CheckCircle2, Clock, XCircle, MinusCircle } from "lucide-react";
import { Badge } from "../ui/badge.jsx";

/*
==================================================
LEAVE HISTORY TABLE
--------------------------------------------------
Purpose:
  Renders leave request history sorted newest
  first with type badge, date range, day count,
  reason, status badge, and applied date.

Props:
  - leaves: array of leave objects
  - isLoading: boolean

Colors:
  Uses only CSS theme variables — no hardcoded
  Tailwind palette colors.
==================================================
*/

const TYPE_BADGE_VARIANT = {
  PTO: "default",
  SICK: "destructive",
  WFH: "secondary",
};

const STATUS_CONFIG = {
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    variant: "secondary",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    variant: "outline",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    variant: "destructive",
  },
};

const formatDate = (str) => {
  if (!str) return "—";
  return new Date(str + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getDayCount = (start, end) => {
  const diff =
    (new Date(end + "T00:00:00") - new Date(start + "T00:00:00")) /
    (1000 * 60 * 60 * 24);
  return diff + 1;
};

const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="py-4 pr-6">
        <div className="h-4 animate-pulse rounded-full bg-muted" />
      </td>
    ))}
  </tr>
);

const TABLE_HEADERS = ["Type", "Duration", "Days", "Reason", "Status", "Applied On"];

const LeaveHistoryTable = ({ leaves, isLoading }) => {
  const sorted = [...(leaves || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {TABLE_HEADERS.map((header, i) => (
              <th
                key={header}
                className={`pb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground ${
                  i < TABLE_HEADERS.length - 1 ? "pr-6" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : sorted.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                No leave requests found.
              </td>
            </tr>
          ) : (
            sorted.map((leave) => {
              const status = STATUS_CONFIG[leave.status] || {
                label: leave.status,
                icon: MinusCircle,
                variant: "outline",
              };
              const StatusIcon = status.icon;
              const days = getDayCount(leave.startDate, leave.endDate);
              const typeBadgeVariant = TYPE_BADGE_VARIANT[leave.type] || "outline";

              return (
                <tr
                  key={leave._id}
                  className="transition hover:bg-muted/40"
                >
                  {/* Type */}
                  <td className="py-4 pr-6">
                    <Badge variant={typeBadgeVariant}>
                      {leave.type}
                    </Badge>
                  </td>

                  {/* Duration */}
                  <td className="py-4 pr-6 text-foreground">
                    <span className="font-medium">
                      {formatDate(leave.startDate)}
                    </span>
                    {leave.startDate !== leave.endDate && (
                      <>
                        <span className="mx-1 text-muted-foreground">→</span>
                        <span className="font-medium">
                          {formatDate(leave.endDate)}
                        </span>
                      </>
                    )}
                  </td>

                  {/* Days */}
                  <td className="py-4 pr-6 text-muted-foreground">
                    {days} {days === 1 ? "day" : "days"}
                  </td>

                  {/* Reason */}
                  <td className="max-w-[180px] py-4 pr-6">
                    <p className="truncate text-muted-foreground">
                      {leave.reason || "—"}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-4 pr-6">
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon size={11} />
                      {status.label}
                    </Badge>
                  </td>

                  {/* Applied On */}
                  <td className="py-4 text-muted-foreground">
                    {leave.appliedAt
                      ? formatDate(leave.appliedAt.slice(0, 10))
                      : formatDate(leave.createdAt?.slice(0, 10))}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveHistoryTable;
