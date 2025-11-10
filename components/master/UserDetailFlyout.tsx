import React from 'react';
import { User } from '../data/users';
import XIcon from '../icons/XIcon';
import Button from '../ui/Button';
import DollarSignIcon from '../icons/DollarSignIcon';
import TrendingUpIcon from '../icons/TrendingUpIcon';
import ZapIcon from '../icons/ZapIcon';

interface UserDetailFlyoutProps {
    user: User | null;
    teamAverage: { totalARR: number, avgConversion: number };
    onClose: () => void;
}

const mockActivity: { text: string; time: string }[] = [];

const UserDetailFlyout: React.FC<UserDetailFlyoutProps> = ({ user, teamAverage, onClose }) => {
    if (!user) return null;

    const maxARR = Math.max(teamAverage.totalARR / 5, user.closedARR) * 1.2; // simplistic avg
    const maxConv = Math.max(teamAverage.avgConversion, user.conversionRate) * 1.2;

    return (
        <div 
            className="fixed inset-0 z-40" 
            aria-labelledby="slide-over-title" 
            role="dialog" 
            aria-modal="true"
        >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <div className="w-screen max-w-md animate-fade-in" style={{ animation: 'slide-in 0.3s ease-out forwards' }}>
                    <div className="h-full flex flex-col bg-white shadow-xl">
                        <header className="p-6 bg-slate-50">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <img className="h-16 w-16 rounded-full" src={user.avatar} alt={user.name} />
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800" id="slide-over-title">{user.name}</h2>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                        <p className="text-sm text-slate-500">{user.phone}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200">
                                    <XIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </header>
                        <main className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* KPIs */}
                            <section>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Performance KPIs</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-slate-50 p-3 rounded-lg"><p className="text-xs text-slate-500">Closed ARR</p><p className="font-bold text-xl text-indigo-600">${user.closedARR.toLocaleString()}</p></div>
                                    <div className="bg-slate-50 p-3 rounded-lg"><p className="text-xs text-slate-500">Conv. Rate</p><p className="font-bold text-xl text-slate-800">{user.conversionRate}%</p></div>
                                    <div className="bg-slate-50 p-3 rounded-lg"><p className="text-xs text-slate-500">Leads</p><p className="font-bold text-xl text-slate-800">{user.leads}</p></div>
                                </div>
                            </section>

                            {/* Charts */}
                            <section>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Performance vs. Team Average</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-semibold text-center text-slate-600 mb-2">Closed ARR</p>
                                        <div className="h-40 flex items-end justify-around gap-4">
                                            <div className="text-center w-1/2"><div className="bg-indigo-300 rounded-t-lg mx-auto" style={{ height: `${(user.closedARR / maxARR) * 100}%` }}></div><p className="text-xs mt-1">You</p></div>
                                            <div className="text-center w-1/2"><div className="bg-slate-200 rounded-t-lg mx-auto" style={{ height: `${((teamAverage.totalARR / 5) / maxARR) * 100}%` }}></div><p className="text-xs mt-1">Avg.</p></div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-center text-slate-600 mb-2">Conversion Rate</p>
                                        <div className="h-40 flex items-end justify-around gap-4">
                                            <div className="text-center w-1/2"><div className="bg-indigo-300 rounded-t-lg mx-auto" style={{ height: `${(user.conversionRate / maxConv) * 100}%` }}></div><p className="text-xs mt-1">You</p></div>
                                            <div className="text-center w-1/2"><div className="bg-slate-200 rounded-t-lg mx-auto" style={{ height: `${(teamAverage.avgConversion / maxConv) * 100}%` }}></div><p className="text-xs mt-1">Avg.</p></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Recent Activity */}
                            <section>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
                                <ul className="space-y-3">
                                    {mockActivity.map((item, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0"><ZapIcon className="w-4 h-4"/></div>
                                            <div>
                                                <p className="text-sm text-slate-700">{item.text}</p>
                                                <p className="text-xs text-slate-400">{item.time}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </main>
                        <footer className="p-4 bg-slate-50 border-t border-slate-200">
                             <Button variant="secondary" className="w-full">View Full Performance Report</Button>
                        </footer>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default UserDetailFlyout;