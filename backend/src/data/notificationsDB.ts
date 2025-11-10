import { Notification, NotificationType } from "../types";

let notifications: Notification[] = [
    // Initial notifications can be added here for testing
    { id: 'notif-1', userId: '1', type: 'new_lead', title: 'New Hot Lead Assigned', description: 'John Doe from Innovatech looks like a great fit.', link: '/bde/leads/lead-1', read: true, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'notif-2', userId: 'master-admin', type: 'task_completed', title: 'Task Completed', description: `David Garcia has completed the task: "Follow up with conference leads"`, link: '/master/dashboard', read: false, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

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