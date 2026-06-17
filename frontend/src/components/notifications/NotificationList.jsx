import NotificationCard from "./NotificationCard.jsx";

/*
==================================================
NOTIFICATION LIST COMPONENT
--------------------------------------------------
Component:
NotificationList

Props:
- notifications
- onMarkRead
- onDelete

Purpose:
Displays a collection of notifications
using reusable NotificationCard components.

Used In:
Employee Notifications Page

Related APIs:
GET    /api/notifications/me
PATCH  /api/notifications/:id/read
DELETE /api/notifications/:id

Features:
- Notification Rendering
- Read Status Updates
- Notification Deletion
- Consistent Card Layout

Business Value:
Acts as the primary notification feed,
allowing employees to view, manage,
and interact with all notification events.

Workflow:
1. Receive filtered notification list
2. Iterate through notifications
3. Render NotificationCard for each item
4. Pass action handlers to child components

Return:
List of notification cards.
==================================================
*/

const NotificationList = ({
  notifications,
  onMarkRead,
  onDelete,
}) => {

  /*
  ==========================================
  NOTIFICATION FEED
  ------------------------------------------
  Purpose:
  Renders all available notifications.

  Business Logic:
  Each notification is displayed using
  a dedicated NotificationCard component
  to maintain UI consistency.

  Actions Supported:
  - Mark As Read
  - Delete Notification

  Child Component:
  NotificationCard
  ==========================================
  */
  return (
    <div className="space-y-4">

      {notifications.map((notification) => (

        <NotificationCard
          key={notification.id}

          /*
          ==============================
          NOTIFICATION DATA
          ==============================
          */
          notification={notification}

          /*
          ==============================
          ACTION HANDLERS
          ------------------------------
          Passed to NotificationCard
          for user interactions.
          ==============================
          */
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />

      ))}

    </div>
  );
};

export default NotificationList;