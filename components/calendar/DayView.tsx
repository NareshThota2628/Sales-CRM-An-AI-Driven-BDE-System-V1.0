import React, { useRef } from 'react';
// FIX: The Meeting type is exported from meetingsDB, not the MeetingsPage component.
import { Meeting } from '../data/meetingsDB';

interface DayViewProps {
  meetings: Meeting[];
  currentDate: Date;
  now: Date;
  onEventClick: (meeting: Meeting) => void;
  onNewEvent: (date: Date) => void;
  onEventDrop: (id: string, newStart: Date, newEnd: Date) => void;
}

const getMeetingStatus = (meeting: Meeting, now: Date): 'upcoming' | 'ongoing' | 'completed' => {
  const start = new Date(meeting.start);
  const end = new Date(meeting.end);
  if (end < now) {
    return 'completed';
  }
  if (start <= now && end >= now) {
    return 'ongoing';
  }
  return 'upcoming';
};


const DayView: React.FC<DayViewProps> = ({ meetings, currentDate, now, onEventClick, onNewEvent, onEventDrop }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayMeetings = meetings.filter(m => new Date(m.start).toDateString() === currentDate.toDateString());

    const getEventPosition = (meeting: Meeting) => {
        const start = new Date(meeting.start);
        const end = new Date(meeting.end);
        const top = (start.getHours() * 60 + start.getMinutes()) / (24 * 60) * 100;
        const duration = (end.getTime() - start.getTime()) / (1000 * 60);
        const height = (duration / (24 * 60)) * 100;
        return { top: `${top}%`, height: `${height}%` };
    };

    const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hour = Math.floor(y / (rect.height / 24));
        
        const newEventDate = new Date(currentDate);
        newEventDate.setHours(hour, 0, 0, 0);
        onNewEvent(newEventDate);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, meeting: Meeting) => {
        e.dataTransfer.setData('meetingId', meeting.id);
        e.dataTransfer.setData('duration', `${(new Date(meeting.end).getTime() - new Date(meeting.start).getTime()) / (1000 * 60)}`);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const meetingId = e.dataTransfer.getData('meetingId');
        const duration = parseInt(e.dataTransfer.getData('duration'), 10);
        
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const totalMinutes = Math.floor(y / (rect.height / (24 * 60)));
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;
        
        const newStartDate = new Date(currentDate);
        newStartDate.setHours(hour, minute, 0, 0);

        const newEndDate = new Date(newStartDate.getTime() + duration * 60000);
        
        onEventDrop(meetingId, newStartDate, newEndDate);
    };
    
    return (
        <div className="flex-1 overflow-y-auto relative grid grid-cols-[auto,1fr]">
            <div className="w-16">
                {hours.map(hour => (
                    <div key={hour} className="h-16 text-right pr-2 text-xs text-slate-400 font-semibold border-t border-slate-200 -mt-px pt-1">
                        {hour === 0 ? '' : `${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'AM' : 'PM'}`}
                    </div>
                ))}
            </div>
            <div 
                ref={containerRef}
                className="relative border-l border-slate-200"
                onClick={handleGridClick}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {hours.map(hour => <div key={hour} className="h-16 border-t border-slate-100"></div>)}
                {dayMeetings.map(meeting => {
                    const { top, height } = getEventPosition(meeting);
                    const status = getMeetingStatus(meeting, now);
                    const statusClasses = {
                        completed: 'bg-slate-100 border-slate-200 text-slate-500 opacity-80 hover:bg-slate-200',
                        ongoing: 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200',
                        upcoming: 'bg-indigo-100 border-indigo-200 text-indigo-800 hover:bg-indigo-200',
                    };
                    return (
                        <div
                            key={meeting.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, meeting)}
                            onClick={(e) => { e.stopPropagation(); onEventClick(meeting); }}
                            className={`absolute left-1 right-1 border rounded-lg p-2 cursor-pointer z-20 ${statusClasses[status]}`}
                            style={{ top, height, minHeight: '20px' }}
                        >
                            {status === 'ongoing' && (
                                <div className="absolute top-0 left-0 h-full w-1 bg-green-400 animate-pulse rounded-l-lg"></div>
                            )}
                            <p className={`font-bold text-sm truncate ${status === 'ongoing' ? 'pl-2' : ''}`}>{meeting.title}</p>
                            <p className={`text-xs truncate ${status === 'ongoing' ? 'pl-2' : ''}`}>{new Date(meeting.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayView;
