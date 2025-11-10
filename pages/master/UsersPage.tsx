import React, { useState, useMemo, useEffect, useRef } from 'react';
import Button from '../../components/ui/Button';
import SearchIcon from '../../components/icons/SearchIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import MoreHorizontalIcon from '../../components/icons/MoreHorizontalIcon';
import UsersIcon from '../../components/icons/UsersIcon';
import UserCheckIcon from '../../components/icons/UserCheckIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import TrendingUpIcon from '../../components/icons/TrendingUpIcon';
import ChevronUpIcon from '../../components/icons/ChevronUpIcon';
import SparklineChart from '../../components/charts/SparklineChart';
import CreateUserModal from '../../components/modals/CreateUserModal';
import UserDetailFlyout from '../../components/master/UserDetailFlyout';
import EditIcon from '../../components/icons/EditIcon';
import UserXIcon from '../../components/icons/UserXIcon';
import LockIcon from '../../components/icons/LockIcon';
import { usersData, User, UserStatus } from '../../components/data/users';

const statusStyles: Record<User['status'], string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-slate-100 text-slate-800',
};

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; delay: number; }> = ({ title, value, icon, color, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-center">
            <p className="text-slate-500 font-medium">{title}</p>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

const MasterUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<User['status'] | 'All'>('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof User | null; direction: 'asc' | 'desc' }>({ key: 'closedARR', direction: 'desc' });
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

    const actionMenuRef = useRef<HTMLDivElement>(null);

    const teamMetrics = useMemo(() => {
        const activeUsers = users.filter(u => u.status === 'Active' && u.role === 'BDE');
        if (activeUsers.length === 0) return { totalARR: 0, avgConversion: 0 };
        const totalARR = activeUsers.reduce((sum, u) => sum + u.closedARR, 0);
        const avgConversion = activeUsers.reduce((sum, u) => sum + u.conversionRate, 0) / activeUsers.length;
        return { totalARR, avgConversion };
    }, [users]);
    
    useEffect(() => {
      const loadUsers = () => {
        try {
            const storedUsers = localStorage.getItem('bde-ai-users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            } else {
                localStorage.setItem('bde-ai-users', JSON.stringify(usersData));
                setUsers(usersData);
            }
        } catch (error) {
            console.error("Failed to load users from localStorage", error);
            setUsers(usersData);
        }
      };
      loadUsers();
      window.addEventListener('storage', loadUsers);
      return () => window.removeEventListener('storage', loadUsers);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setOpenActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredAndSortedUsers = useMemo(() => {
        let filtered = users.filter(user =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'All' || user.status === statusFilter)
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [users, searchTerm, statusFilter, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof User) => {
        if (sortConfig.key !== key) return null;
        return <ChevronUpIcon className={`w-4 h-4 ml-1 transition-transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />;
    };
    
    const handleCreateUser = (userData: Omit<User, 'id' | 'avatar' | 'status' | 'leads' | 'conversionRate' | 'closedARR' | 'performanceHistory'>) => {
        const newUser: User = {
            id: `usr-${Date.now()}`,
            ...userData,
            avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
            status: 'Active',
            leads: 0,
            conversionRate: 0,
            closedARR: 0,
            performanceHistory: [],
        };

        const updatedUsers = [newUser, ...users];
        setUsers(updatedUsers);
        localStorage.setItem('bde-ai-users', JSON.stringify(updatedUsers));
        
        // This logic should be on the backend, but we'll simulate it
        const credentials = JSON.parse(localStorage.getItem('bde-ai-credentials') || '{}');
        credentials[userData.email] = (userData as any).password;
        localStorage.setItem('bde-ai-credentials', JSON.stringify(credentials));

        setCreateModalOpen(false);
    };

    const handleDeactivateUser = (userId: string) => {
        // FIX: Explicitly type `updatedUsers` as `User[]` to ensure type compatibility with the state setter.
        const updatedUsers: User[] = users.map(u => u.id === userId ? {...u, status: u.status === 'Active' ? 'Inactive' : 'Active'} : u);
        setUsers(updatedUsers);
        localStorage.setItem('bde-ai-users', JSON.stringify(updatedUsers));
        setOpenActionMenu(null);
    };

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">User Management</h1>
                <p className="text-slate-500 mt-1">Administer your team and monitor their performance.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Team ARR" value={`$${(teamMetrics.totalARR / 1000000).toFixed(2)}M`} icon={<DollarSignIcon className="w-5 h-5 text-green-600" />} color="bg-green-100" delay={100} />
                <KpiCard title="Active BDEs" value={users.filter(u => u.status === 'Active' && u.role === 'BDE').length.toString()} icon={<UserCheckIcon className="w-5 h-5 text-blue-600" />} color="bg-blue-100" delay={200} />
                <KpiCard title="Avg. Conversion Rate" value={`${teamMetrics.avgConversion.toFixed(1)}%`} icon={<TrendingUpIcon className="w-5 h-5 text-indigo-600" />} color="bg-indigo-100" delay={300} />
                <KpiCard title="Total Users" value={users.length.toString()} icon={<UsersIcon className="w-5 h-5 text-slate-600" />} color="bg-slate-100" delay={400} />
            </section>

            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" placeholder="Search user..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-50 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <select onChange={e => setStatusFilter(e.target.value as any)} value={statusFilter} className="bg-slate-50 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <Button onClick={() => setCreateModalOpen(true)} leftIcon={<PlusIcon className="w-4 h-4" />}>Create User</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('name')}>User</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('leads')}>Leads {getSortIndicator('leads')}</th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('conversionRate')}>Conv. % {getSortIndicator('conversionRate')}</th>
                                <th className="px-4 py-3 cursor-pointer" onClick={() => requestSort('closedARR')}>Closed ARR {getSortIndicator('closedARR')}</th>
                                <th className="px-4 py-3">Performance Trend</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedUsers.map((user, index) => (
                                <tr key={user.id} onClick={() => setSelectedUser(user)} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors animate-fade-in cursor-pointer" style={{ animationDelay: `${index * 30}ms`}}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full"/>
                                            <div>
                                                <p className="font-bold text-slate-800">{user.name}</p>
                                                <p className="text-slate-500 text-xs">{user.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[user.status]}`}>{user.status}</span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">{user.leads}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-700">{user.conversionRate}%</td>
                                    <td className="px-4 py-3 font-bold text-indigo-600">${user.closedARR.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        {user.performanceHistory.length > 1 && <SparklineChart data={user.performanceHistory.map(p => p.arr)} />}
                                    </td>
                                    <td className="px-4 py-3 text-right relative">
                                        <button onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === user.id ? null : user.id)}} className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                                            <MoreHorizontalIcon className="w-5 h-5" />
                                        </button>
                                        {openActionMenu === user.id && (
                                            <div ref={actionMenuRef} className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-1">
                                                <button className="w-full flex items-center gap-2 p-2 text-sm text-left rounded hover:bg-slate-100"><EditIcon className="w-4 h-4"/> Edit User</button>
                                                <button onClick={(e) => {e.stopPropagation(); handleDeactivateUser(user.id)}} className="w-full flex items-center gap-2 p-2 text-sm text-left rounded hover:bg-slate-100">
                                                    <UserXIcon className="w-4 h-4"/> {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button className="w-full flex items-center gap-2 p-2 text-sm text-left rounded hover:bg-slate-100"><LockIcon className="w-4 h-4"/> Reset Password</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            
            <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSave={handleCreateUser} />
            <UserDetailFlyout user={selectedUser} teamAverage={teamMetrics} onClose={() => setSelectedUser(null)} />
        </div>
    );
};

export default MasterUsersPage;