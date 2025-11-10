import React from 'react';
// FIX: The Meeting type is exported from meetingsDB, not the MeetingsPage component.
import { Meeting } from '../data/meetingsDB';

interface MonthViewProps {
  meetings: Meeting[];
  currentDate: Date;
  onDayClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ meetings, currentDate, onDayClick }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => new Date(year, month, i + 1));
    const startingDay = firstDayOfMonth.getDay();

    const today = new Date();
    const isToday = (date: Date) => date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

    return (
        <div className="p-4">
            <div className="grid grid-cols-7 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-semibold text-slate-500 text-sm py-2">{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 border-t border-l border-slate-200">
                {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} className="border-r border-b border-slate-200 bg-slate-50"></div>)}
                {daysInMonth.map(day => {
                    const meetingsOnDay = meetings.filter(m => {
                        const mDate = new Date(m.start);
                        return mDate.getDate() === day.getDate() && mDate.getMonth() === day.getMonth() && mDate.getFullYear() === day.getFullYear();
                    });

                    return (
                        <div key={day.toString()} onClick={() => onDayClick(day)} className="border-r border-b border-slate-200 h-28 p-2 text-left cursor-pointer hover:bg-slate-50 transition-colors">
                            <span className={`font-semibold text-slate-700 w-7 h-7 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-indigo-600 text-white' : ''}`}>
                                {day.getDate()}
                            </span>
                            <div className="mt-1 space-y-1 overflow-hidden">
                                {meetingsOnDay.slice(0, 2).map(meeting => (
                                    <div key={meeting.id} className="bg-indigo-100 text-indigo-800 text-xs font-semibold p-1 rounded truncate">
                                        {meeting.title}
                                    </div>
                                ))}
                                {meetingsOnDay.length > 2 && <div className="text-xs text-slate-500 font-semibold">+ {meetingsOnDay.length - 2} more</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;
