// FIX: Import `Request` and `Response` types directly from Express for robust type safety in handlers.
import { Request, Response } from 'express';
import * as notificationsDB from './data/notificationsDB';

export const handleGetNotificationsForUser = (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }
    const notifications = notificationsDB.getNotificationsForUser(userId);
    res.json(notifications);
};

export const handleMarkNotificationsAsRead = (req: Request, res: Response) => {
    const { userId, notificationIds } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (notificationIds && Array.isArray(notificationIds)) {
        // Mark specific notifications as read
        notificationsDB.markAsRead(userId, notificationIds);
    } else {
        // Mark all as read
        notificationsDB.markAllAsRead(userId);
    }

    res.status(200).json({ message: 'Notifications marked as read.' });
};