import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Bell,
  CalendarCheck,
  CalendarX2,
  ClipboardCheck,
  ClipboardList,
  AlertTriangle,
  CalendarClock,
  FolderPlus,
} from "lucide-react";
import { Badge } from "../ui/badge.jsx";

dayjs.extend(relativeTime);

const TYPE_META = {
  REMINDER: {
    label: "Reminder",
    category: "System",
    icon: Bell,
  },
  TASK_ASSIGNED: {
    label: "Task Assigned",
    category: "Task",
    icon: ClipboardList,
  },
  TASK_COMPLETED: {
    label: "Task Completed",
    category: "Task",
    icon: ClipboardCheck,
  },
  LEAVE_APPROVED: {
    label: "Leave Approved",
    category: "Leave",
    icon: CalendarCheck,
  },
  LEAVE_REJECTED: {
    label: "Leave Rejected",
    category: "Leave",
    icon: CalendarX2,
  },
  MISSING_LOG: {
    label: "Work Log Missing",
    category: "Attendance",
    icon: AlertTriangle,
  },
  PLAN_PUBLISHED: {
    label: "Shift Plan",
    category: "Shift",
    icon: CalendarClock,
  },
  PROJECT_CREATED: {
    label: "Project Created",
    category: "System",
    icon: FolderPlus,
  },
};

const resolveMeta = (type) => {
  return TYPE_META[type] || {
    label: type ? type.replace(/_/g, " ") : "Notification",
    category: "System",
    icon: Bell,
  };
};

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const meta = resolveMeta(notification.type);
  const Icon = meta.icon;
  const isUnread = !notification.read;
  const createdAt = notification.createdAt || notification.sentAt;

  return (
    <div
      className={`rounded-3xl border p-5 transition hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] ${
        isUnread
          ? "border-primary/30 bg-white"
          : "border-border bg-muted/40"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            isUnread
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon size={22} />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {isUnread && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                <h3
                  className={`text-base font-semibold ${
                    isUnread ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {notification.title || meta.label}
                </h3>
                <Badge variant="outline" className="text-[10px] uppercase tracking-[0.2em]">
                  {meta.category}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {notification.message}
              </p>
            </div>

            <span className="text-xs font-medium text-muted-foreground">
              {createdAt ? dayjs(createdAt).fromNow() : "Just now"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
              >
                Mark Read
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className="rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
