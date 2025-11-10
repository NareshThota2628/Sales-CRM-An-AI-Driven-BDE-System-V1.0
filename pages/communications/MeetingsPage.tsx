import React, { useState, useCallback, useEffect } from 'react';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import MonthView from '../../components/calendar/MonthView';
import WeekView from '../../components/calendar/WeekView';
import DayView from '../../components/calendar/DayView';
import MeetingModal from '../../components/modals/MeetingModal';
import MeetingDetailModal from '../../components/modals/MeetingDetailModal';
import { Meeting, meetingsDB } from '../../components/data/meetingsDB';

const MeetingsPage: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>(meetingsDB.getAll());
    const [currentDate, setCurrentDate] = useState(new Date('2024-07-15')); // Fixed date for consistent demo
    const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('week');
    const [now, setNow] = useState(new Date());
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [modalDate, setModalDate] = useState<Date | null>(null);

    useEffect(() => {
        const handleStorageChange = () => {
            setMeetings(meetingsDB.getAll());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const handleOpenCreateModal = (date?: Date) => {
        setSelectedMeeting(null);
        setModalDate(date || new Date());
        setIsCreateModalOpen(true);
    };

    const handleOpenDetailModal = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setIsDetailModalOpen(true);
    };

    const handleSaveMeeting = (meetingData: Omit<Meeting, 'id'>) => {
        if (selectedMeeting) {
            // Update
            meetingsDB.update({ ...meetingData, id: selectedMeeting.id });
        } else {
            // Create
            meetingsDB.add(meetingData);
        }
        setMeetings(meetingsDB.getAll());
        setIsCreateModalOpen(false);
        setSelectedMeeting(null);
    };

    const handleDeleteMeeting = () => {
        if (selectedMeeting) {
            meetingsDB.delete(selectedMeeting.id);
            setMeetings(meetingsDB.getAll());
            setIsDetailModalOpen(false);
            setSelectedMeeting(null);
        }
    };

    const handleUpdateMeetingTime = useCallback((id: string, newStart: Date, newEnd: Date) => {
        const meetingToUpdate = meetings.find(m => m.id === id);
        if (meetingToUpdate) {
            meetingsDB.update({ ...meetingToUpdate, start: newStart, end: newEnd });
            setMeetings(meetingsDB.getAll());
        }
    }, [meetings]);

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col font-sans">
            <header className="px-1 mb-6 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Meeting Scheduler</h1>
                <p className="text-slate-500 mt-1">Organize your schedule and prepare for meetings with AI assistance.</p>
            </header>
            
            <CalendarHeader 
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                activeView={activeView}
                setActiveView={setActiveView}
                onAddMeeting={() => handleOpenCreateModal()}
            />

            <main className="flex-1 overflow-y-auto bg-white rounded-b-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                {activeView === 'month' && <MonthView meetings={meetings} currentDate={currentDate} onDayClick={(day) => { setCurrentDate(day); setActiveView('day'); }} />}
                {activeView === 'week' && <WeekView meetings={meetings} currentDate={currentDate} now={now} onEventClick={handleOpenDetailModal} onNewEvent={handleOpenCreateModal} onEventDrop={handleUpdateMeetingTime} />}
                {activeView === 'day' && <DayView meetings={meetings} currentDate={currentDate} now={now} onEventClick={handleOpenDetailModal} onNewEvent={handleOpenCreateModal} onEventDrop={handleUpdateMeetingTime} />}
            </main>
            
            <MeetingModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setSelectedMeeting(null); }}
                onSave={handleSaveMeeting}
                meeting={selectedMeeting}
                initialDate={modalDate}
            />

            <MeetingDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                meeting={selectedMeeting}
                onDelete={handleDeleteMeeting}
                onEdit={() => { setIsDetailModalOpen(false); setIsCreateModalOpen(true); }}
            />
        </div>
    );
};

export default MeetingsPage;