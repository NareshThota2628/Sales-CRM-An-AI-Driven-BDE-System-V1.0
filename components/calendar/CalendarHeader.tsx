import React from 'react';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  activeView: 'month' | 'week' | 'day';
  setActiveView: (view: 'month' | 'week' | 'day') => void;
  onAddMeeting: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, setCurrentDate, activeView, setActiveView, onAddMeeting }) => {
    
    const changeDate = (delta: number) => {
        const newDate = new Date(currentDate);
        if (activeView === 'month') {
            newDate.setMonth(newDate.getMonth() + delta);
        } else if (activeView === 'week') {
            newDate.setDate(newDate.getDate() + (delta * 7));
        } else {
            newDate.setDate(newDate.getDate() + delta);
        }
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    }

    const getHeaderTitle = () => {
        if (activeView === 'month') {
            return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        }
        if (activeView === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            return `${startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }
        return currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-t-2xl border-b border-slate-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
            <button onClick={() => changeDate(-1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><ChevronLeftIcon className="w-5 h-5" /></button>
            <button onClick={() => changeDate(1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors"><ChevronRightIcon className="w-5 h-5" /></button>
        </div>
        <button onClick={goToToday} className="px-4 py-2 text-sm font-semibold border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors">Today</button>
         <h2 className="text-xl font-bold text-slate-800">{getHeaderTitle()}</h2>
      </div>
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
        {(['month', 'week', 'day'] as const).map(view => (
            <button key={view} onClick={() => setActiveView(view)} className={`capitalize px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeView === view ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:bg-white/60'}`}>
                {view}
            </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
