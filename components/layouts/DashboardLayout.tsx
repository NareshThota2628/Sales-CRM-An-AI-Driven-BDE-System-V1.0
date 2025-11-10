import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import SearchIcon from '../icons/SearchIcon';
import HomeIcon from '../icons/HomeIcon';
import ZapIcon from '../icons/ZapIcon';
import BuildingsIcon from '../icons/BuildingsIcon';
import UsersIcon from '../icons/UsersIcon';
import SettingsIcon from '../icons/SettingsIcon';
import CalendarDaysIcon from '../icons/CalendarDaysIcon';
import LayoutDashboardIcon from '../icons/LayoutDashboardIcon';
import FileCheckIcon from '../icons/FileCheckIcon';
import BarChartIcon from '../icons/BarChartIcon';
import SlidersIcon from '../icons/SlidersIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import BellIcon from '../icons/BellIcon';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationToastContainer from '../ui/NotificationToastContainer';

// FIX: Define an interface for navigation items to allow for the optional 'count' property.
interface NavItem {
    to: string;
    icon: React.ReactNode;
    label: string;
    count?: number;
}


const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<'bde' | 'master' | null>(null);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const { unreadCount } = useNotifications();


    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role === 'master' || role === 'bde') {
            setUserRole(role as 'bde' | 'master');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const bdeNavItems: NavItem[] = [
        { to: '/bde/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/bde/leads', icon: <ZapIcon className="w-5 h-5" />, label: 'Leads' },
        { to: '/bde/companies', icon: <BuildingsIcon className="w-5 h-5" />, label: 'My Companies' },
        { to: '/team', icon: <UsersIcon className="w-5 h-5" />, label: 'Team' },
        { to: '/notifications', icon: <BellIcon className="w-5 h-5" />, label: 'Notifications', count: unreadCount },
        { to: '/communications/meetings', icon: <CalendarDaysIcon className="w-5 h-5" />, label: 'Meetings' },
    ];
    
    const masterNavItems: NavItem[] = [
        { to: '/master/dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/master/conversion-requests', icon: <FileCheckIcon className="w-5 h-5" />, label: 'Approvals', count: 12 },
        { to: '/master/companies', icon: <BuildingsIcon className="w-5 h-5" />, label: 'Companies' },
        { to: '/master/users', icon: <UsersIcon className="w-5 h-5" />, label: 'Users' },
        { to: '/master/analytics', icon: <BarChartIcon className="w-5 h-5" />, label: 'Analytics' },
        { to: '/notifications', icon: <BellIcon className="w-5 h-5" />, label: 'Notifications', count: unreadCount },
        { to: '/communications/meetings', icon: <CalendarDaysIcon className="w-5 h-5" />, label: 'Meetings' },
    ];
    
    const commonNavItems: NavItem[] = [
        { to: '/settings', icon: <SettingsIcon className="w-5 h-5" />, label: 'Settings' },
    ];

    if (!userRole) {
        return null; // or a loading spinner
    }

    const navItems = userRole === 'master' ? masterNavItems : bdeNavItems;
    const profile = userRole === 'master' 
        ? { name: 'Master Admin', role: 'System Controller', avatar: 'https://i.pravatar.cc/150?img=12' }
        : { name: 'Amélie Laurent', role: 'BDE', avatar: 'https://i.pravatar.cc/150?img=1' };


    return (
        <div className="flex h-screen bg-[#F4F7FE] font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col">
                <div className="p-6 border-b border-slate-200/80 h-20 flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="https://media.licdn.com/dms/image/v2/D4D0BAQEQHDp3om_eug/company-logo_200_200/company-logo_200_200/0/1702105920324/highq_labs_pvt_ltd_logo?e=2147483647&v=beta&t=scIhNIvxzHNCJLSbJEfkjTHSzC42y1kqWB_Lz0UOTvM" alt="HighQ-Labs Logo" className="w-8 h-8" />
                        <span className="text-xl font-bold text-slate-800">Sales CRM</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{userRole === 'master' ? 'Admin Menu' : 'Menu'}</p>
                        <ul className="space-y-1">
                            {navItems.map(item => (
                                <li key={item.to}>
                                    <NavLink to={item.to} end={item.to.endsWith('/dashboard')} className={({ isActive }) => `flex items-center justify-between py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        {item.count && item.count > 0 && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.label === 'Approvals' ? 'bg-indigo-200 text-indigo-800' : 'bg-red-200 text-red-800'}`}>{item.count}</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">General</p>
                        <ul className="space-y-1">
                            {commonNavItems.map(item => (
                                <li key={item.to}>
                                    <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        {item.icon}<span>{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                             {userRole === 'master' && (
                                 <li>
                                    <NavLink to="/master/admin" className={({ isActive }) => `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        <SlidersIcon className="w-5 h-5" />
                                        <span>System Admin</span>
                                    </NavLink>
                                 </li>
                             )}
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <NotificationToastContainer />
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 flex items-center justify-between px-8 flex-shrink-0 z-10">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search..." className="w-full sm:w-80 bg-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/notifications" className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                            <BellIcon className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </Link>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                <img className="w-9 h-9 rounded-full" src={profile.avatar} alt="avatar" />
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold text-slate-800 text-left">{profile.name}</p>
                                    <p className="text-xs text-slate-500 text-left">{profile.role}</p>
                                </div>
                                <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                                    <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setProfileOpen(false)}>My Profile</Link>
                                    <Link to="/settings" className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setProfileOpen(false)}>Settings</Link>
                                    <hr className="my-1 border-slate-100" />
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;