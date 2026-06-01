import NotificationCard from "./NotificationCard.jsx";

/*
==================================================
NOTIFICATION LIST
--------------------------------------------------
Purpose:
  Renders a list of notification cards.
==================================================
*/

const NotificationList = ({ notifications, onMarkRead, onDelete }) => {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList;
