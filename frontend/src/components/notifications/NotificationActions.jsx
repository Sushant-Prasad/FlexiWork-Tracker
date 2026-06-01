import { Button } from "../ui/button.jsx";

/*
==================================================
NOTIFICATION ACTIONS
--------------------------------------------------
Purpose:
  Renders bulk actions for notification management.

Props:
  - unreadCount: number
  - readCount: number
  - onMarkAllRead: () => void
  - onClearRead: () => void
  - isWorking: boolean
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
    <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border bg-card px-5 py-4">
      <div className="text-sm text-muted-foreground">
        {unreadCount} unread • {readCount} read
      </div>

      <div className="ml-auto flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0 || isWorking}
          className="rounded-full"
        >
          Mark All Read
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClearRead}
          disabled={readCount === 0 || isWorking}
          className="rounded-full"
        >
          Clear Read
        </Button>
      </div>
    </div>
  );
};

export default NotificationActions;
