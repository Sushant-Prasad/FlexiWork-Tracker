import { Button } from "../ui/button.jsx";

/*
==================================================
NOTIFICATION ACTIONS
--------------------------------------------------
Component:
NotificationActions

Props:
- unreadCount
- readCount
- onMarkAllRead
- onClearRead
- isWorking

Purpose:
Displays bulk action controls for managing
notifications, including marking all
notifications as read and clearing all
read notifications.

Used In:
Employee Notifications Page

Related APIs:
- PATCH /api/notifications/read-all
- DELETE /api/notifications/read

Features:
- Unread & Read Counters
- Mark All Read Action
- Clear Read Action
- Loading Protection
- Responsive Layout
- Disabled State Handling

Business Value:
Allows users to efficiently manage large
numbers of notifications with a single
action, reducing manual effort and
improving overall user productivity.

Workflow:
1. Display notification counts.
2. Enable actions only when applicable.
3. Execute bulk action.
4. Disable controls while request is
   being processed.
5. Refresh notification list.

Returns:
Notification bulk action toolbar.
==================================================
*/

const NotificationActions = ({
  unreadCount,
  readCount,
  onMarkAllRead,
  onClearRead,
  isWorking,
}) => {

  return (

    /*
    ==========================================
    ACTION TOOLBAR
    ------------------------------------------
    Displays notification statistics along
    with bulk management actions.
    ==========================================
    */
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card px-5 py-4">

      {/* ==================================
          NOTIFICATION COUNTS
          ----------------------------------
          Shows the current number of unread
          and read notifications.
      ================================== */}
      <div className="text-sm text-muted-foreground">
        {unreadCount} unread • {readCount} read
      </div>

      {/* ==================================
          BULK ACTION BUTTONS
          ----------------------------------
          Provides actions for managing all
          notifications at once.
      ================================== */}
      <div className="ml-auto flex flex-wrap gap-2">

        {/* Mark All Notifications as Read */}
        <Button
          type="button"
          onClick={onMarkAllRead}
          disabled={
            unreadCount === 0 ||
            isWorking
          }
          className="rounded-full"
        >
          Mark All Read
        </Button>

        {/* Clear All Read Notifications */}
        <Button
          type="button"
          variant="outline"
          onClick={onClearRead}
          disabled={
            readCount === 0 ||
            isWorking
          }
          className="rounded-full"
        >
          Clear Read
        </Button>

      </div>

    </div>

  );

};

export default NotificationActions;