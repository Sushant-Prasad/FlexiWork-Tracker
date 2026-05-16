import Notification from "../models/Notifications.js"; // Notification model

// Create a notification entry for a user
export const sendNotification = async ({ userId, title, message, type, relatedId }) => {
  await Notification.create({
    userId,
    title,
    message,
    type,
    relatedId,
  });
};
