import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerUpdate } from '../data/careerUpdatesDB';
import Button from '../ui/Button';
import BriefcaseIcon from '../icons/BriefcaseIcon';
import TrendingUpIcon from '../icons/TrendingUpIcon';
import NewspaperIcon from '../icons/NewspaperIcon';
import { teamMembersData } from '../data/team';

const typeInfo = {
    job_change: { icon: <BriefcaseIcon className="w-5 h-5" />, color: 'blue' },
    hiring_signal: { icon: <TrendingUpIcon className="w-5 h-5" />, color: 'green' },
    company_news: { icon: <NewspaperIcon className="w-5 h-5" />, color: 'purple' },
    promotion: { icon: <TrendingUpIcon className="w-5 h-5" />, color: 'indigo' },
};

const CareerUpdateCard: React.FC<{ update: CareerUpdate; showBdeOwner?: boolean }> = ({ update, showBdeOwner }) => {
    const navigate = useNavigate();
    const info = typeInfo[update.type];
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-400 text-blue-800',
        green: 'bg-green-50 border-green-400 text-green-800',
        purple: 'bg-purple-50 border-purple-400 text-purple-800',
        indigo: 'bg-indigo-50 border-indigo-400 text-indigo-800',
    };

    const bde = showBdeOwner ? teamMembersData.find(m => m.id === update.bdeOwnerId) : null;

    return (
        <div className={`w-80 flex-shrink-0 p-4 rounded-xl border-l-4 ${colorClasses[info.color]}`}>
            <div className="flex items-start justify-between">
                <div className={`flex items-center gap-2 font-bold text-sm`}>
                    {info.icon}
                    {update.title}
                </div>
                <span className="text-xs text-slate-500">{update.timestamp}</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
                <img src={update.leadAvatar} alt={update.leadName} className="w-8 h-8 rounded-full" />
                <p className={`text-xs mt-1`}>{update.description}</p>
            </div>
            {bde && (
                 <div className="text-xs text-slate-500 font-semibold mt-2 text-right">
                    Lead Owner: {bde.name.split(' ')[0]}
                </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
                <Button onClick={() => navigate(`/bde/leads/${update.leadId}`)} size="sm" variant="secondary" className="!text-xs">View Profile</Button>
                <Button size="sm" variant="secondary" className="!text-xs">Dismiss</Button>
            </div>
        </div>
    );
};

interface CareerPulseWidgetProps {
  updates: CareerUpdate[];
  showBdeOwner?: boolean;
}

const CareerPulseWidget: React.FC<CareerPulseWidgetProps> = ({ updates, showBdeOwner }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {updates.length > 0 ? (
                updates.map((update, index) => <CareerUpdateCard key={update.id} update={update} showBdeOwner={showBdeOwner} />)
            ) : (
                <div className="text-center text-slate-500 py-8 w-full">No recent updates from your leads.</div>
            )}
        </div>
    );
};

export default CareerPulseWidget;
