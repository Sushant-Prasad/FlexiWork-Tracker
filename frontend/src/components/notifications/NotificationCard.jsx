/*
==================================================
NOTIFICATION CARD COMPONENT
--------------------------------------------------
Component:
NotificationCard

Helper:
resolveMeta()

Purpose:
Displays a single notification with
type-specific iconography, category,
message details, timestamp, and actions.

Used In:
Employee Notifications Page

Related APIs:
GET    /api/notifications/me
PATCH  /api/notifications/:id/read
DELETE /api/notifications/:id

Features:
- Notification Type Recognition
- Read / Unread Status
- Relative Timestamp
- Mark As Read Action
- Delete Notification Action
- Dynamic Icons & Categories

Business Value:
Provides users with a centralized
communication center for tasks,
attendance, leave approvals, system
alerts, and project updates.

Workflow:
1. Receive notification object
2. Resolve notification metadata
3. Display notification content
4. Allow user actions
5. Update notification state

Return:
Single notification card.
==================================================
*/

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

/*
==================================================
DAYJS CONFIGURATION
--------------------------------------------------
Purpose:
Enables relative time formatting.

Example:
- 5 minutes ago
- 2 hours ago
- 1 day ago

Business Logic:
Improves readability of notification
timestamps.
==================================================
*/
dayjs.extend(relativeTime);

/*
==================================================
NOTIFICATION TYPE CONFIGURATION
--------------------------------------------------
Purpose:
Maps notification types to:
- Labels
- Categories
- Icons

Business Logic:
Provides consistent visual representation
for different notification categories.

Supported Types:
- REMINDER
- TASK_ASSIGNED
- TASK_COMPLETED
- LEAVE_APPROVED
- LEAVE_REJECTED
- MISSING_LOG
- PLAN_PUBLISHED
- PROJECT_CREATED
==================================================
*/
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

/*
==================================================
NOTIFICATION METADATA RESOLVER
--------------------------------------------------
Function:
resolveMeta()

Parameters:
- type

Purpose:
Resolves notification configuration
based on notification type.

Workflow:
1. Lookup notification type
2. Return mapped metadata
3. Apply fallback configuration

Fallback:
Uses generic notification settings
when type is unknown.

Return:
{
  label,
  category,
  icon
}
==================================================
*/
const resolveMeta = (type) => {
  return (
    TYPE_META[type] || {
      label: type
        ? type.replace(/_/g, " ")
        : "Notification",

      category: "System",

      icon: Bell,
    }
  );
};

/*
==================================================
NOTIFICATION CARD
--------------------------------------------------
Component:
NotificationCard

Props:
- notification
- onMarkRead
- onDelete

Purpose:
Displays notification details and
provides user actions.

Features:
- Read / Unread Indicator
- Notification Category
- Relative Timestamp
- Mark Read Action
- Delete Action

Business Value:
Ensures employees stay informed about:
- Tasks
- Attendance
- Leave Requests
- Projects
- Shift Plans
- System Alerts

Return:
Interactive notification card.
==================================================
*/
const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
}) => {

  /*
  ==========================================
  NOTIFICATION METADATA
  ------------------------------------------
  Purpose:
  Retrieves icon, label, and category
  configuration for the notification.
  ==========================================
  */
  const meta = resolveMeta(notification.type);

  const Icon = meta.icon;

  /*
  ==========================================
  READ STATUS
  ------------------------------------------
  Purpose:
  Determines whether notification
  requires user attention.

  Business Logic:
  Unread notifications receive
  visual emphasis.
  ==========================================
  */
  const isUnread = !notification.read;

  /*
  ==========================================
  TIMESTAMP RESOLUTION
  ------------------------------------------
  Purpose:
  Uses available timestamp field.

  Priority:
  1. createdAt
  2. sentAt

  Business Logic:
  Supports multiple backend formats.
  ==========================================
  */
  const createdAt =
    notification.createdAt ||
    notification.sentAt;

  return (
    <div
      className={`rounded-3xl border p-5 transition hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] ${
        isUnread
          ? "border-primary/30 bg-white"
          : "border-border bg-muted/40"
      }`}
    >

      {/* ======================================
          CARD CONTENT
      ====================================== */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">

        {/* ======================================
            NOTIFICATION ICON
        ====================================== */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            isUnread
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >

          <Icon size={22} />

        </div>

        {/* ======================================
            NOTIFICATION DETAILS
        ====================================== */}
        <div className="flex-1">

          <div className="flex flex-wrap items-start justify-between gap-3">

            {/* ==================================
                TITLE & CATEGORY
            ================================== */}
            <div>

              <div className="flex flex-wrap items-center gap-2">

                {/* Unread Indicator */}
                {isUnread && (
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}

                {/* Notification Title */}
                <h3
                  className={`text-base font-semibold ${
                    isUnread
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {notification.title || meta.label}
                </h3>

                {/* Notification Category */}
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase tracking-[0.2em]"
                >
                  {meta.category}
                </Badge>

              </div>

              {/* Notification Message */}
              <p className="mt-2 text-sm text-muted-foreground">
                {notification.message}
              </p>

            </div>

            {/* ==================================
                TIMESTAMP
            ================================== */}
            <span className="text-xs font-medium text-muted-foreground">

              {createdAt
                ? dayjs(createdAt).fromNow()
                : "Just now"}

            </span>

          </div>

          {/* ======================================
              ACTION BUTTONS
          ====================================== */}
          <div className="mt-4 flex flex-wrap items-center gap-3">

            {/* ==============================
                MARK AS READ
            ============================== */}
            {!notification.read && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
              >
                Mark Read
              </button>
            )}

            {/* ==============================
                DELETE NOTIFICATION
            ============================== */}
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