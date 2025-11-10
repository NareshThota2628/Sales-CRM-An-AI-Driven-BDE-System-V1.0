import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import ArrowRightLeftIcon from '../../components/icons/ArrowRightLeftIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import TargetIcon from '../../components/icons/TargetIcon';
import UserPlusIcon from '../../components/icons/UserPlusIcon';
import ChevronDownIcon from '../../components/icons/ChevronDownIcon';
import StickyNoteIcon from '../../components/icons/StickyNoteIcon';
import PhoneIcon from '../../components/icons/PhoneIcon';
import VideoIcon from '../../components/icons/VideoIcon';
import MailIcon from '../../components/icons/MailIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import SpinnerIcon from '../../components/icons/SpinnerIcon';
import { getLeadById, updateLead, LeadDetail, Activity, getActivityIcon, ActivityType } from '../../components/data/leadsDB';
import { assigneeAvatars } from '../../components/data/users';
import { LeadStatus } from '../../types';
import AIInsightsCard from '../../components/bde/AIInsightsCard';
import HandshakeIcon from '../../components/icons/HandshakeIcon';
import LinkedinIcon from '../../components/icons/LinkedinIcon';
import Share2Icon from '../../components/icons/Share2Icon';

const allStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Unqualified', 'Closed'];

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 ring-blue-200',
  Contacted: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  Qualified: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  Proposal: 'bg-purple-100 text-purple-800 ring-purple-200',
  Negotiation: 'bg-orange-100 text-orange-800 ring-orange-200',
  Unqualified: 'bg-slate-100 text-slate-800 ring-slate-200',
  Closed: 'bg-green-100 text-green-800 ring-green-200',
};

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; delay: number }> = ({ icon, label, value, delay }) => (
    <div className="flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${delay}ms`}}>
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <div className="font-semibold text-slate-800 break-all">{value}</div>
        </div>
    </div>
);

const LeadStatusUpdater: React.FC<{ currentStatus: LeadStatus; onChange: (status: LeadStatus) => void }> = ({ currentStatus, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex justify-between items-center px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${statusStyles[currentStatus]}`}>
                {currentStatus}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                    {allStatuses.map(status => (
                        <button key={status} onClick={() => { onChange(status); setIsOpen(false); }} className={`w-full text-left px-3 py-2 text-sm font-semibold hover:bg-slate-50 ${status === currentStatus ? 'text-indigo-600' : 'text-slate-700'}`}>
                            {status}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const LeadDetailPage: React.FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const [lead, setLead] = useState<LeadDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [interactionType, setInteractionType] = useState<ActivityType>('note');
    const [noteContent, setNoteContent] = useState('');

    useEffect(() => {
        setIsLoading(true);
        if (leadId) {
            const leadData = getLeadById(leadId);
            if (leadData) {
                setLead(leadData);
            }
        }
        setIsLoading(false);
    }, [leadId]);
    
    const handleUpdateLead = (updatedLead: LeadDetail) => {
        setLead(updatedLead);
        updateLead(updatedLead);
    };

    const addActivity = (type: ActivityType, content: string) => {
        if (!lead || !content.trim()) return;

        const newActivity: Activity = {
            id: `act-${Date.now()}`,
            type: type,
            content: content,
            author: 'Amélie Laurent', // Current user
            time: 'Just now',
        };

        const updatedLead = {
            ...lead,
            activity: [newActivity, ...lead.activity],
        };
        handleUpdateLead(updatedLead);
    };

    const handleLogInteraction = (e: React.FormEvent) => {
        e.preventDefault();
        addActivity(interactionType, noteContent);
        setNoteContent('');
    };
    
    const handleStatusChange = (newStatus: LeadStatus) => {
        if (!lead || newStatus === lead.status) return;
        const content = `Status changed from ${lead.status} to ${newStatus}.`;
        
        const newActivity: Activity = {
            id: `act-${Date.now()}`,
            type: 'status_change',
            content: content,
            author: 'System',
            time: 'Just now',
        };
        
        const updatedLead = {
            ...lead,
            status: newStatus,
            activity: [newActivity, ...lead.activity],
        };
        handleUpdateLead(updatedLead);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><SpinnerIcon className="w-8 h-8 text-indigo-500" /></div>;
    }

    if (!lead) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-800">Lead not found</h2>
                <p className="text-slate-500">The lead you are looking for does not exist.</p>
                <Link to="/bde/leads"><Button className="mt-4">Back to Leads</Button></Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                        <Link to="/bde/leads" className="hover:text-slate-800">Leads</Link>
                        <ChevronRightIcon className="w-4 h-4" />
                        <span className="text-slate-800 font-semibold">{lead.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold text-slate-800">{lead.name}</h1>
                        <p className="text-2xl text-slate-400 font-light">@ {lead.company}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" leftIcon={<MailIcon className="w-4 h-4" />} onClick={() => navigate('/bde/email/compose', { state: { lead } })}>Email</Button>
                    <Button leftIcon={<ArrowRightLeftIcon className="w-4 h-4" />} onClick={() => navigate(`/bde/conversion/${lead.id}`)}>Request Conversion</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* Left Column */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="flex flex-col items-center text-center">
                            <img src={lead.companyLogo} alt={lead.company} className="w-20 h-20 mb-4"/>
                            <h2 className="text-xl font-bold text-slate-800">{lead.company}</h2>
                        </div>
                        <hr className="my-6 border-slate-100" />
                        <div className="space-y-4">
                             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Status</h3>
                             <LeadStatusUpdater currentStatus={lead.status} onChange={handleStatusChange} />
                             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pt-4">Details</h3>
                             <InfoCard icon={<DollarSignIcon className="w-5 h-5" />} label="Value" value={`$${lead.value.toLocaleString()}`} delay={200} />
                             <InfoCard icon={<TargetIcon className="w-5 h-5" />} label="Source" value={lead.source} delay={300} />
                             <InfoCard 
                                icon={<UserPlusIcon className="w-5 h-5" />} 
                                label="Assigned To" 
                                value={<div className="flex items-center gap-2"><img src={assigneeAvatars[lead.assignedTo]} className="w-6 h-6 rounded-full" /><span>{lead.assignedToName}</span></div>} 
                                delay={400} 
                            />
                            <InfoCard icon={<MailIcon className="w-5 h-5" />} label="Email" value={<a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">{lead.email}</a>} delay={500} />
                            <InfoCard 
                                icon={<Share2Icon className="w-5 h-5" />}
                                label="Social Profiles" 
                                value={
                                    <div className="flex items-center gap-2">
                                        {lead.linkedinUrl && (
                                            <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-200 rounded-full text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors" aria-label="LinkedIn Profile">
                                                <LinkedinIcon className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                } 
                                delay={600} 
                            />
                        </div>
                    </div>
                    <AIInsightsCard insights={lead.aiInsights} />
                </aside>

                {/* Center Column */}
                <main className="lg:col-span-2 xl:col-span-2 space-y-6">
                     <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Log Interaction</h3>
                        <div className="flex gap-2 mb-4 border-b border-slate-200">
                           {(['note', 'call', 'meeting'] as ActivityType[]).map(type => (
                               <button key={type} onClick={() => setInteractionType(type)} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold capitalize border-b-2 ${interactionType === type ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                   {getActivityIcon(type)} {type}
                               </button>
                           ))}
                        </div>
                        <form onSubmit={handleLogInteraction}>
                            <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder={`Add a ${interactionType} log...`} rows={4} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            <Button className="w-full mt-4" type="submit" leftIcon={<PlusIcon className="w-4 h-4"/>}>Add to Timeline</Button>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Activity Feed</h3>
                        <div className="relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            {lead.activity.map((item, index) => (
                                <div key={item.id} className="relative mb-8 animate-fade-in" style={{ animationDuration: '0.5s'}}>
                                    <div className="absolute -left-[35px] top-0 w-8 h-8 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center">
                                        {getActivityIcon(item.type)}
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-700">{item.content}</p>
                                        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                            <span>by {item.author}</span>
                                            <span>{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Right Column */}
                <aside className="lg:col-span-3 xl:col-span-1">
                     <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Related</h3>
                        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Contacts</h4>
                        <div className="space-y-3 mb-6">
                            {lead.related?.contacts.map(contact => (
                                <div key={contact.name} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                    <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{contact.name}</p>
                                        <p className="text-xs text-slate-500">{contact.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Deals</h4>
                         <div className="space-y-3">
                             {lead.related?.deals.map(deal => (
                                <div key={deal.name} className="p-3 bg-slate-50 rounded-lg">
                                    <p className="font-semibold text-slate-800 text-sm">{deal.name}</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <p className="text-slate-500">{deal.stage}</p>
                                        <p className="font-bold text-indigo-600">${deal.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                             ))}
                         </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default LeadDetailPage;