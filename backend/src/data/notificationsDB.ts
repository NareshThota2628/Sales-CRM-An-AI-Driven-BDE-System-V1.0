import { Notification, NotificationType } from "../types";

let notifications: Notification[] = [];

export const getNotificationsForUser = (userId: string) => {
    return notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addNotification = (notifData: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
        ...notifData,
        id: `notif-${Date.now()}`,
        read: false,
        timestamp: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
};

export const markAsRead = (userId: string, notificationIds: string[]) => {
    notifications = notifications.map(n => {
        if (n.userId === userId && notificationIds.includes(n.id)) {
            return { ...n, read: true };
        }
        return n;
    });
};

export const markAllAsRead = (userId: string) => {
    notifications = notifications.map(n => {
        if (n.userId === userId) {
            return { ...n, read: true };
        }
        return n;
    });
};