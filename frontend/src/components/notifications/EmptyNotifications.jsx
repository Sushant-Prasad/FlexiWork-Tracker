/*
==================================================
EMPTY NOTIFICATIONS
--------------------------------------------------
Component:
EmptyNotifications

Props:
- title (optional)
- description (optional)

Purpose:
Displays an informative empty state when
there are no notifications available to
display based on the current filters.

Used In:
Employee Notifications Page

Features:
- Custom Title
- Custom Description
- Responsive Layout
- Reusable Empty State
- Theme-Aware Styling

Business Value:
Provides clear user feedback instead of
showing an empty screen, improving user
experience and helping users understand
that there are currently no notifications
to display.

Workflow:
1. Notification list is checked.
2. If no notifications are available,
   this component is rendered.
3. Displays customizable title and
   description.

Returns:
Notification empty state card.
==================================================
*/

const EmptyNotifications = ({
  title = "You're all caught up",
  description = "No notifications match your current filters.",
}) => {

  return (

    /*
    ==========================================
    EMPTY STATE CONTAINER
    ------------------------------------------
    Displays a friendly message informing
    the user that no notifications are
    currently available.
    ==========================================
    */
    <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">

      {/* Empty State Title */}
      <h3 className="text-lg font-semibold text-foreground">
        {title}
      </h3>

      {/* Empty State Description */}
      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>

    </div>

  );

};

export default EmptyNotifications;