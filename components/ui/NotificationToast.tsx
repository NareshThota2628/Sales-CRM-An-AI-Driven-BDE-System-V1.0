import React, { useEffect, useState } from 'react';
import XIcon from '../icons/XIcon';
import Button from './Button';
import { Notification, NotificationType } from '../../contexts/NotificationContext';
import ZapIcon from '../icons/ZapIcon';
import MessageSquareIcon from '../icons/MessageSquareIcon';
import CheckCheckIcon from '../icons/CheckCheckIcon';
import BotIcon from '../icons/BotIcon';
import BriefcaseIcon from '../icons/BriefcaseIcon';
// FIX: Import UsersIcon for task-related notifications.
import UsersIcon from '../icons/UsersIcon';

// FIX: Added missing notification types `task_assigned`, `task_progress`, and `task_completed` to satisfy the `NotificationType` record.
const notificationIcons: Record<NotificationType, React.ReactNode> = {
    new_lead: <ZapIcon className="w-6 h-6 text-indigo-500" />,
    chat_mention: <MessageSquareIcon className="w-6 h-6 text-blue-500" />,
    conversion_approved: <CheckCheckIcon className="w-6 h-6 text-green-500" />,
    ai_insight: <BotIcon className="w-6 h-6 text-purple-500" />,
    career_update: <BriefcaseIcon className="w-6 h-6 text-slate-700" />,
    task_assigned: <UsersIcon className="w-6 h-6 text-yellow-600" />,
    task_progress: <ZapIcon className="w-6 h-6 text-orange-500" />,
    task_completed: <CheckCheckIcon className="w-6 h-6 text-green-500" />,
};


interface NotificationToastProps {
    notification: Notification;
    onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        const showTimer = setTimeout(() => setIsVisible(true), 100);
        
        // Auto dismiss after 5 seconds
        const dismissTimer = setTimeout(() => handleDismiss(), 5000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(dismissTimer);
        };
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // Wait for fade out animation before calling onDismiss
        setTimeout(() => onDismiss(notification.id), 400);
    };

    return (
        <div 
            className={`
                w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden
                transform transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-95'}
            `}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            {notificationIcons[notification.type]}
                        </div>
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-600 truncate">{notification.description}</p>
                        {notification.link && (
                            <div className="mt-3">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="!text-xs"
                                    onClick={() => {
                                        handleDismiss();
                                        window.location.hash = notification.link;
                                    }}
                                >
                                    View Details
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={handleDismiss} className="p-1 rounded-md inline-flex text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-100 w-full">
                <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-shrink-width"
                    style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                ></div>
            </div>

            <style>{`
                @keyframes shrink-width {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-shrink-width {
                    animation: shrink-width 5s linear forwards;
                }
            `}</style>
        </div>
    );
};

export default NotificationToast;