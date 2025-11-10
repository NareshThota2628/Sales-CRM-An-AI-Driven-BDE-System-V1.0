import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../components/icons/SearchIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import { teamMembersData, TeamMember } from '../../components/data/team';
import ProgressBar from '../../components/ui/ProgressBar';
import UsersIcon from '../../components/icons/UsersIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import BarChart3Icon from '../../components/icons/BarChart3Icon';
import WifiIcon from '../../components/icons/WifiIcon';
import GridViewIcon from '../../components/icons/GridViewIcon';
import ListViewIcon from '../../components/icons/ListViewIcon';


const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-5">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);


const TeamMemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
    const quotaAttainment = member.stats ? Math.round((member.stats.closedARR / 150000) * 100) : 0; // Assuming 150k quota

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="text-center">
                <div className="relative inline-block">
                    <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-100" />
                    <span className={`absolute bottom-2 right-2 block h-4 w-4 rounded-full border-2 border-white ${member.online ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{member.role}</p>
            </div>
            <div className="space-y-3 mt-auto">
                 <div className="text-left">
                     <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                        <span className="font-semibold">Quota Attainment</span>
                        <span className="font-bold text-indigo-600">{quotaAttainment}%</span>
                     </div>
                     <ProgressBar value={quotaAttainment} />
                </div>
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <div className="text-center">
                        <p className="text-xs text-slate-500">Closed ARR</p>
                        <p className="font-bold text-slate-800">${(member.stats?.closedARR || 0) / 1000}k</p>
                    </div>
                     <div className="text-center">
                        <p className="text-xs text-slate-500">Conv. Rate</p>
                        <p className="font-bold text-slate-800">{member.stats?.conversionRate}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamDirectoryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('name-asc');
    const [view, setView] = useState('grid');
    const navigate = useNavigate();

    const teamStats = useMemo(() => ({
        total: teamMembersData.length,
        online: teamMembersData.filter(m => m.online).length,
        totalARR: teamMembersData.reduce((acc, m) => acc + (m.stats?.closedARR || 0), 0),
    }), []);

    const roles = useMemo(() => ['All', ...Array.from(new Set(teamMembersData.map(m => m.role)))], []);

    const filteredAndSortedMembers = useMemo(() => {
        let members = [...teamMembersData];
        if (searchTerm) {
            members = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterRole !== 'All') {
            members = members.filter(m => m.role === filterRole);
        }
        if (filterStatus !== 'All') {
            members = members.filter(m => (filterStatus === 'Online' && m.online) || (filterStatus === 'Offline' && !m.online));
        }
        
        const [key, direction] = sortBy.split('-');
        members.sort((a, b) => {
            let valA, valB;
            if (key === 'name') {
                valA = a.name;
                valB = b.name;
            } else {
                valA = a.stats?.[key] || 0;
                valB = b.stats?.[key] || 0;
            }

            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        return members;
    }, [searchTerm, filterRole, filterStatus, sortBy]);

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Team Directory</h1>
                <p className="text-slate-500 mt-1">Browse, analyze, and connect with your colleagues.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <KpiCard title="Total Team Members" value={teamStats.total.toString()} icon={<UsersIcon className="w-6 h-6 text-blue-600"/>} color="bg-blue-100" />
                <KpiCard title="Members Online" value={teamStats.online.toString()} icon={<WifiIcon className="w-6 h-6 text-green-600"/>} color="bg-green-100" />
                <KpiCard title="Total Closed ARR" value={`$${(teamStats.totalARR / 1000000).toFixed(1)}M`} icon={<DollarSignIcon className="w-6 h-6 text-indigo-600"/>} color="bg-indigo-100" />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap justify-between items-center gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="relative">
                    <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 py-2 pl-10 pr-4 bg-slate-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
                    <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <div className="flex items-center gap-4">
                    <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-slate-100 border-none rounded-lg text-sm font-medium p-2 focus:ring-2 focus:ring-yellow-400">
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                     <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-slate-100 border-none rounded-lg text-sm font-medium p-2 focus:ring-2 focus:ring-yellow-400">
                        <option value="All">All Statuses</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                    </select>
                     <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-100 border-none rounded-lg text-sm font-medium p-2 focus:ring-2 focus:ring-yellow-400">
                        <option value="name-asc">Sort by Name (A-Z)</option>
                        <option value="name-desc">Sort by Name (Z-A)</option>
                        <option value="closedARR-desc">Sort by ARR (High-Low)</option>
                        <option value="conversionRate-desc">Sort by Conv. Rate (High-Low)</option>
                    </select>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}><GridViewIcon className="w-5 h-5 text-slate-600"/></button>
                    <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow-sm' : ''}`}><ListViewIcon className="w-5 h-5 text-slate-600"/></button>
                </div>
            </div>

            {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedMembers.map((member, index) => (
                        <TeamMemberCard key={member.id} member={member} index={index + 2} />
                    ))}
                </div>
            ) : (
                <div className="bg-white p-4 rounded-xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="p-3">Member</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Leads</th>
                                <th className="p-3 text-right">Conv. Rate</th>
                                <th className="p-3 text-right">Closed ARR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedMembers.map(member => (
                                <tr key={member.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-bold text-slate-800">{member.name}</p>
                                                <p className="text-slate-500">{member.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className={`flex items-center gap-2 font-semibold ${member.online ? 'text-green-600' : 'text-slate-500'}`}>
                                            <span className={`w-2 h-2 rounded-full ${member.online ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            {member.online ? 'Online' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="p-3 font-semibold text-slate-700 text-right">{member.stats?.leads}</td>
                                    <td className="p-3 font-semibold text-slate-700 text-right">{member.stats?.conversionRate}%</td>
                                    <td className="p-3 font-bold text-indigo-600 text-right">${member.stats?.closedARR.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TeamDirectoryPage;