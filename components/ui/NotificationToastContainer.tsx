import React, { useState, useEffect } from 'react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const NotificationToastContainer: React.FC = () => {
    const { notifications, markToastShown } = useNotifications();
    const [toasts, setToasts] = useState<Notification[]>([]);

    useEffect(() => {
        const newNotifications = notifications.filter(n => !n.toast);
        if (newNotifications.length > 0) {
            setToasts(prevToasts => [...prevToasts, ...newNotifications]);
            newNotifications.forEach(n => markToastShown(n.id));
        }
    }, [notifications, markToastShown]);

    const handleDismiss = (id: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <div className="fixed top-6 right-6 z-[100] w-full max-w-sm space-y-3">
            {toasts.map(notification => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismiss}
                />
            ))}
        </div>
    );
};

export default NotificationToastContainer;
