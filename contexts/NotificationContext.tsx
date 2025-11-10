import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { NotificationType as BackendNotificationType } from '../types';

export type NotificationType = BackendNotificationType;

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    read: boolean;
    link: string;
    toast?: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    dismissNotification: (id: string) => void;
    markToastShown: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper to get current user ID (mocked)
const getCurrentUserId = () => {
    const role = localStorage.getItem('userRole');
    return role === 'master' ? 'master-admin' : '1'; // '1' is Amélie Laurent
};

function timeAgo(isoString: string): string {
    const date = new Date(isoString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (isNaN(seconds)) return 'some time ago';

    let interval = seconds / 31536000;
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    return "Just now";
}


export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = async () => {
        const userId = getCurrentUserId();
        try {
            const response = await fetch(`/api/notifications/${userId}`);
            if (response.ok) {
                const backendNotifications = await response.json();
                
                setNotifications(currentNotifications => {
                    const existingIds = new Set(currentNotifications.map(n => n.id));
                    const newNotifications = backendNotifications
                        .filter((n: any) => !existingIds.has(n.id))
                        .map((n: any) => ({
                            ...n,
                            time: timeAgo(n.timestamp),
                            toast: false // Mark new notifications for toasting
                        }));

                    // We need to merge gracefully, keeping existing toast status
                    const updatedNotifications = backendNotifications.map((bn: any) => {
                         const existing = currentNotifications.find(cn => cn.id === bn.id);
                         return {
                             ...bn,
                             time: timeAgo(bn.timestamp),
                             toast: existing ? existing.toast : false
                         };
                    });
                    
                    // Filter out dismissed notifications that might reappear from backend
                    const activeIds = new Set(updatedNotifications.map(n => n.id));
                    const stillDismissed = currentNotifications.filter(n => !activeIds.has(n.id));

                    return [...updatedNotifications, ...stillDismissed].sort((a,b) => b.id.localeCompare(a.id));
                });
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);


    const markAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        await fetch('/api/notifications/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: getCurrentUserId(), notificationIds: [id] })
        });
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        await fetch('/api/notifications/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: getCurrentUserId() })
        });
    };

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    const markToastShown = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, toast: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, dismissNotification, markToastShown, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};