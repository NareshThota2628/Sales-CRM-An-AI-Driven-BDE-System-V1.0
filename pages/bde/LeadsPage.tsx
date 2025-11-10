import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusIcon from '../../components/icons/PlusIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import FilterIcon from '../../components/icons/FilterIcon';
import ZapIcon from '../../components/icons/ZapIcon';
import FireIcon from '../../components/icons/FireIcon';
import TrendingUpIcon from '../../components/icons/TrendingUpIcon';
import ClockIcon from '../../components/icons/ClockIcon';
import FileDownIcon from '../../components/icons/FileDownIcon';
import MoreVerticalIcon from '../../components/icons/MoreVerticalIcon';
import EditIcon from '../../components/icons/EditIcon';
import UserPlusIcon from '../../components/icons/UserPlusIcon';
import StickyNoteIcon from '../../components/icons/StickyNoteIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import MailIcon from '../../components/icons/MailIcon';
import PhoneIcon from '../../components/icons/PhoneIcon';
import LinkedinIcon from '../../components/icons/LinkedinIcon';

// Types
type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Unqualified' | 'Closed';
type AIScore = 'Hot' | 'Warm' | 'Cold';
type LeadSource = 'Webinar' | 'Cold Call' | 'Referral' | 'Website' | 'Advertisement' | 'Other';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  linkedin: string;
  location: string;
  company: string;
  companyLogo: string;
  status: LeadStatus;
  aiScore: AIScore;
  source: LeadSource;
  lastContact: string;
  assignedTo: string;
  notes?: string;
}

// Mock Data
const leadsData: Lead[] = [];

const assigneeAvatars: { [key: string]: string } = {};

// Style Mappings
const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-indigo-100 text-indigo-800',
  Proposal: 'bg-purple-100 text-purple-800',
  Negotiation: 'bg-orange-100 text-orange-800',
  Unqualified: 'bg-slate-100 text-slate-800',
  Closed: 'bg-green-100 text-green-800',
};

const aiScoreStyles: Record<AIScore, string> = {
  Hot: 'bg-red-500',
  Warm: 'bg-yellow-500',
  Cold: 'bg-blue-500',
};

const allStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Unqualified', 'Closed'];
const allSources: LeadSource[] = ['Webinar', 'Cold Call', 'Referral', 'Website', 'Advertisement', 'Other'];
const allAiScores: AIScore[] = ['Hot', 'Warm', 'Cold'];

// Components
const KpiCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; color: string, delay: number }> = ({ title, value, change, icon, color, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
        <p className={`text-sm font-semibold mt-4 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</p>
    </div>
);

const ActionMenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick: (e: React.MouseEvent) => void; className?: string; }> = ({ icon, label, onClick, className }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-100 transition-colors ${className}`}>
        {icon}
        <span>{label}</span>
    </button>
);


const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(() => {
        const role = localStorage.getItem('userRole');
        if (role === 'bde') {
            // Hardcode 'usr-1' for Amélie Laurent for demo purposes
            return leadsData.filter(l => l.assignedTo === 'usr-1');
        }
        return leadsData;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: 'All', source: 'All', aiScore: 'All', location: '' });
    const [isAiSortActive, setIsAiSortActive] = useState(false);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState(new Set<string>());
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    
    const navigate = useNavigate();
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setOpenActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredAndSortedLeads = useMemo(() => {
        let filtered = leads.filter(lead =>
            (lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
             lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             lead.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filters.status === 'All' || lead.status === filters.status) &&
            (filters.source === 'All' || lead.source === filters.source) &&
            (filters.aiScore === 'All' || lead.aiScore === filters.aiScore) &&
            (filters.location === '' || lead.location.toLowerCase().includes(filters.location.toLowerCase()))
        );

        if (isAiSortActive) {
            const scoreOrder: Record<AIScore, number> = { Hot: 1, Warm: 2, Cold: 3 };
            filtered.sort((a, b) => scoreOrder[a.aiScore] - scoreOrder[b.aiScore]);
        }
        
        return filtered;
    }, [leads, searchTerm, filters, isAiSortActive]);

    const handleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredAndSortedLeads.map(l => l.id)));
        } else {
            setSelectedIds(new Set());
        }
    };
    
    const handleBulkDelete = () => {
        setLeads(leads.filter(l => !selectedIds.has(l.id)));
        setSelectedIds(new Set());
    };

    const handleBulkStatusChange = (newStatus: LeadStatus) => {
        setLeads(leads.map(l => selectedIds.has(l.id) ? { ...l, status: newStatus } : l));
        setSelectedIds(new Set());
        setIsStatusModalOpen(false);
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Lead Management</h1>
                    <p className="text-slate-500 mt-1">Harness AI to discover, qualify, and convert your next big opportunity.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 py-2 px-4 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
                        <FileDownIcon className="w-4 h-4" />
                        Import Leads
                    </button>
                    <button
                        onClick={() => navigate('/bde/leads/new')}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add New Lead
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="New Leads" value="0" change="" icon={<ZapIcon className="w-5 h-5 text-indigo-600" />} color="bg-indigo-100" delay={100} />
                <KpiCard title="Hot Leads (AI)" value="0" change="" icon={<FireIcon className="w-5 h-5 text-red-600" />} color="bg-red-100" delay={200} />
                <KpiCard title="Conversion Rate" value="0%" change="" icon={<TrendingUpIcon className="w-5 h-5 text-green-600" />} color="bg-green-100" delay={300} />
                <KpiCard title="Avg. Response" value="-" change="" icon={<ClockIcon className="w-5 h-5 text-yellow-600" />} color="bg-yellow-100" delay={400} />
            </section>

            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" placeholder="Search leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-50 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => setIsFilterModalOpen(true)} leftIcon={<FilterIcon className="w-4 h-4" />}>
                            Advanced Filters
                        </Button>
                    </div>
                     <button onClick={() => setIsAiSortActive(!isAiSortActive)} className={`flex items-center gap-2 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${isAiSortActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                        <ZapIcon className={`w-5 h-5 transition-colors ${isAiSortActive ? 'text-yellow-300' : 'text-indigo-500'}`} />
                        AI Smart Sort
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                            <tr>
                                <th className="p-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.size > 0 && selectedIds.size === filteredAndSortedLeads.length} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" /></th>
                                <th className="px-4 py-3">Lead Name</th>
                                <th className="px-4 py-3">AI Score</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Last Contact</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedLeads.map((lead, index) => (
                                <tr 
                                    key={lead.id}
                                    className={`border-b border-slate-100 transition-colors ${selectedIds.has(lead.id) ? 'bg-indigo-50' : 'hover:bg-slate-50/50'}`} 
                                >
                                    <td className="p-4"><input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => handleSelect(lead.id)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" /></td>
                                    <td className="px-4 py-3 cursor-pointer" onClick={() => navigate(`/bde/leads/${lead.id}`)}>
                                        <div className="flex items-center gap-3">
                                            <img src={lead.companyLogo} alt={lead.company} className="w-8 h-8"/>
                                            <div>
                                                <p className="font-bold text-slate-800">{lead.name}</p>
                                                <p className="text-slate-500">{lead.designation}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${aiScoreStyles[lead.aiScore]}`}></span>
                                            <span className="font-semibold text-slate-700">{lead.aiScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[lead.status]}`}>{lead.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="text-slate-500 hover:text-indigo-600"><MailIcon className="w-4 h-4"/></a>
                                            <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="text-slate-500 hover:text-indigo-600"><PhoneIcon className="w-4 h-4"/></a>
                                            <a href={`https://${lead.linkedin}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-slate-500 hover:text-indigo-600"><LinkedinIcon className="w-4 h-4"/></a>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{lead.location}</td>
                                    <td className="px-4 py-3 text-slate-500">{lead.lastContact}</td>
                                    <td className="px-4 py-3 text-right relative">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenActionMenu(openActionMenu === lead.id ? null : lead.id);
                                            }}
                                            className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
                                        >
                                            <MoreVerticalIcon className="w-5 h-5" />
                                        </button>
                                        {openActionMenu === lead.id && (
                                            <div ref={actionMenuRef} className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-10 animate-fade-in" style={{ animationDuration: '0.15s'}}>
                                                <div className="p-1">
                                                     <ActionMenuItem icon={<EditIcon className="w-4 h-4" />} label="Change Status" onClick={(e) => e.stopPropagation()} />
                                                     <ActionMenuItem icon={<UserPlusIcon className="w-4 h-4" />} label="Re-assign" onClick={(e) => e.stopPropagation()} />
                                                     <ActionMenuItem icon={<StickyNoteIcon className="w-4 h-4" />} label="Log Interaction" onClick={(e) => e.stopPropagation()} />
                                                     <hr className="my-1 border-slate-100" />
                                                     <ActionMenuItem icon={<TrashIcon className="w-4 h-4" />} label="Delete Lead" onClick={(e) => { e.stopPropagation(); setLeads(leads.filter(l => l.id !== lead.id)); setOpenActionMenu(null); }} className="!text-red-600 hover:!bg-red-50" />
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {selectedIds.size > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded-xl shadow-2xl flex items-center gap-4 px-6 py-3 animate-fade-in z-20">
                    <p className="font-semibold">{selectedIds.size} selected</p>
                    <div className="h-6 w-px bg-slate-600"></div>
                    <Button size="sm" variant="secondary" className="!bg-slate-700 !text-white hover:!bg-slate-600" onClick={() => setIsStatusModalOpen(true)}>Change Status</Button>
                    <Button size="sm" variant="secondary" className="!bg-red-500/20 !text-red-300 hover:!bg-red-500/30 !border-red-500/30" onClick={handleBulkDelete}>Delete</Button>
                </div>
            )}
            
            <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Advanced Filters</h2>
                    <div className="space-y-4">
                        <select onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} value={filters.status} className="w-full p-3 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                            <option value="All">All Statuses</option>
                            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                         <select onChange={e => setFilters(f => ({ ...f, source: e.target.value }))} value={filters.source} className="w-full p-3 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                             <option value="All">All Sources</option>
                            {allSources.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select onChange={e => setFilters(f => ({ ...f, aiScore: e.target.value }))} value={filters.aiScore} className="w-full p-3 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                             <option value="All">All AI Scores</option>
                            {allAiScores.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input type="text" placeholder="Filter by Location..." value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} className="w-full p-3 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                     <div className="pt-6 flex justify-end">
                        <Button onClick={() => setIsFilterModalOpen(false)}>Apply Filters</Button>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Change Status</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {allStatuses.map(status => (
                            <Button key={status} variant="secondary" onClick={() => handleBulkStatusChange(status)}>{status}</Button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default LeadsPage;