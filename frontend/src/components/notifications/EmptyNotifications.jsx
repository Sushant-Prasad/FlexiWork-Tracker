/*
==================================================
EMPTY NOTIFICATIONS
--------------------------------------------------
Purpose:
  Simple empty state for notification lists.
==================================================
*/

const EmptyNotifications = ({
  title = "You're all caught up",
  description = "No notifications match your current filters.",
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default EmptyNotifications;
