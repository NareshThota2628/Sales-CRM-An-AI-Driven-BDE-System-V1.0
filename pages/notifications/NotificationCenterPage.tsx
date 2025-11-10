import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ZapIcon from '../../components/icons/ZapIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import CheckCheckIcon from '../../components/icons/CheckCheckIcon';
import BotIcon from '../../components/icons/BotIcon';
import XIcon from '../../components/icons/XIcon';
import BriefcaseIcon from '../../components/icons/BriefcaseIcon';
import { useNotifications, Notification, NotificationType } from '../../contexts/NotificationContext';
import UsersIcon from '../../components/icons/UsersIcon';

const notificationIcons: Record<NotificationType, React.ReactNode> = {
    new_lead: <ZapIcon className="w-5 h-5 text-indigo-500" />,
    chat_mention: <MessageSquareIcon className="w-5 h-5 text-blue-500" />,
    conversion_approved: <CheckCheckIcon className="w-5 h-5 text-green-500" />,
    ai_insight: <BotIcon className="w-5 h-5 text-purple-500" />,
    career_update: <BriefcaseIcon className="w-5 h-5 text-slate-700" />,
    task_assigned: <UsersIcon className="w-5 h-5 text-yellow-600" />,
    task_progress: <ZapIcon className="w-5 h-5 text-orange-500" />,
    task_completed: <CheckCheckIcon className="w-5 h-5 text-green-500" />,
};

const NotificationItem: React.FC<{ notification: Notification; onDismiss: (id: string) => void; onMarkAsRead: (id: string) => void; index: number }> = ({ notification, onDismiss, onMarkAsRead, index }) => {
    return (
        <div
            className={`
                relative flex items-start gap-4 p-4 rounded-lg transition-all duration-300
                ${notification.read ? 'bg-slate-50/70' : 'bg-indigo-50'}
                animate-fade-in
            `}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {!notification.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm ml-4">
                {notificationIcons[notification.type]}
            </div>
            <div className="flex-grow">
                <Link to={notification.link} onClick={() => onMarkAsRead(notification.id)} className="focus:outline-none">
                    <p className="font-bold text-slate-800 hover:underline">{notification.title}</p>
                    <p className="text-sm text-slate-600">{notification.description}</p>
                </Link>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-400 mb-2">{notification.time}</p>
                <button onClick={() => onDismiss(notification.id)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


const NotificationCenterPage: React.FC = () => {
    const { notifications, dismissNotification, markAsRead, markAllAsRead, unreadCount } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
         if (filter === 'read') {
            return notifications.filter(n => n.read);
        }
        return notifications;
    }, [notifications, filter]);

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Notifications</h1>
                <p className="text-slate-500 mt-1">All your alerts and updates in one place.</p>
            </header>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                     <div className="flex items-center gap-2">
                        <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>All</button>
                        <button onClick={() => setFilter('unread')} className={`px-4 py-2 text-sm font-semibold rounded-lg relative ${filter === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                            Unread
                            {unreadCount > 0 && filter !== 'unread' && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">{unreadCount}</span>}
                        </button>
                        <button onClick={() => setFilter('read')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'read' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>Read</button>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Mark all as read
                        </button>
                    )}
                </div>
                
                <div className="space-y-3">
                    {filteredNotifications.map((n, index) => (
                       <NotificationItem 
                            key={n.id}
                            notification={n}
                            onDismiss={dismissNotification}
                            onMarkAsRead={markAsRead}
                            index={index}
                       />
                    ))}
                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p className="font-semibold">All caught up!</p>
                            <p>You have no notifications in this view.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default NotificationCenterPage;