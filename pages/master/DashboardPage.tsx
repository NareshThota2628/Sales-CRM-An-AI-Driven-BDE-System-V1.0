import React, { useState, useEffect, useMemo } from 'react';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import ZapIcon from '../../components/icons/ZapIcon';
import TrendingUpIcon from '../../components/icons/TrendingUpIcon';
import FileCheckIcon from '../../components/icons/FileCheckIcon';
import ClockIcon from '../../components/icons/ClockIcon';
import AreaChart from '../../components/charts/AreaChart';
import PlusIcon from '../../components/icons/PlusIcon';
import Button from '../../components/ui/Button';
import TaskModal from '../../components/modals/TaskModal';
import { assigneeAvatars } from '../../components/data/users';
import CareerPulseWidget from '../../components/bde/CareerPulseWidget';
import { careerUpdatesDB } from '../../components/data/careerUpdatesDB';
import BriefcaseIcon from '../../components/icons/BriefcaseIcon';

const kpiData = [
  { title: "Total ARR", value: "$4.8M", change: "+12.5% MoM", icon: <DollarSignIcon className="w-6 h-6 text-green-600" />, color: "bg-green-100", delay: 100 },
  { title: "New Monthly Leads", value: "1,240", change: "+8.2% MoM", icon: <ZapIcon className="w-6 h-6 text-indigo-600" />, color: "bg-indigo-100", delay: 200 },
  { title: "Overall Conversion Rate", value: "18.7%", change: "+1.1% MoM", icon: <TrendingUpIcon className="w-6 h-6 text-blue-600" />, color: "bg-blue-100", delay: 300 },
  { title: "Pending Approvals", value: "12", change: "3 new today", icon: <FileCheckIcon className="w-6 h-6 text-yellow-600" />, color: "bg-yellow-100", delay: 400 },
];

const revenueData = [
  { label: "Sep", value: 380000 },
  { label: "Oct", value: 420000 },
  { label: "Nov", value: 400000 },
  { label: "Dec", value: 480000 },
  { label: "Jan", value: 510000 },
  { label: "Feb", value: 550000 },
];

const topBDEs = [
    { name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', value: '$120,500', metric: 'Closed ARR (Q1)' },
    { name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', value: '18', metric: 'Conversions (Q1)' },
    { name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', value: '92%', metric: 'Qualification Rate' },
];

const activityFeed = [
    { text: 'Amélie Laurent converted Quantum Leap ($120k ARR)', time: '2h ago' },
    { text: '12 new leads from the AI in Sales webinar have been assigned', time: '8h ago' },
    { text: 'David Garcia requested conversion for Solutions Inc.', time: '1 day ago' },
    { text: 'System-wide conversion rate increased by 0.2%', time: '2 days ago' },
];

type Status = 'todo' | 'inprogress' | 'completed';
type Priority = 'Important' | 'Meh' | 'OK' | 'High Priority' | 'Not that important';

interface Comment {
  user: string;
  avatar: string;
  text: string;
  time: string;
}

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  comments: number;
  assignees: string[];
  assigner?: string;
  commentData?: Comment[];
}

const KpiCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; color: string, delay: number }> = ({ title, value, change, icon, color, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
        <p className={`text-sm font-semibold mt-4 ${change.startsWith('+') ? 'text-green-600' : 'text-slate-500'}`}>{change}</p>
    </div>
);

const TaskTracker: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const fetchTasks = () => {
        fetch('/api/tasks')
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleSaveTask = async (newTaskData: { title: string; priority: string; assignees: string[] }) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTaskData),
            });
            if (response.ok) {
                const newTask = await response.json();
                setTasks(prevTasks => [newTask, ...prevTasks]);
                setIsTaskModalOpen(false);
            } else {
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const statusClasses: Record<Status, string> = {
        todo: 'bg-indigo-100 text-indigo-700',
        inprogress: 'bg-amber-100 text-amber-700',
        completed: 'bg-green-100 text-green-700',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '800ms' }}>
            <TaskModal 
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleSaveTask}
            />
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">Team Task Tracker</h3>
                <Button onClick={() => setIsTaskModalOpen(true)} leftIcon={<PlusIcon className="w-4 h-4" />}>Assign Task</Button>
            </div>
            <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase border-b border-slate-200 sticky top-0 bg-white">
                        <tr>
                            <th className="px-4 py-3">Task</th>
                            <th className="px-4 py-3">Assigned To</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-semibold text-slate-800">{task.title}</td>
                                <td className="px-4 py-3">
                                    <div className="flex -space-x-2">
                                        {task.assignees.map(id => <img key={id} src={assigneeAvatars[id]} className="w-7 h-7 rounded-full border-2 border-white" alt="assignee" />)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${statusClasses[task.status]}`}>
                                        {task.status === 'inprogress' ? 'In Progress' : task.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-medium text-slate-600">{task.priority}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const MasterDashboardPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Master Dashboard</h1>
                <p className="text-slate-500 mt-1">Executive overview of team performance and key metrics.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </section>
            
            <section className="animate-fade-in" style={{ animationDelay: '500ms' }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="w-6 h-6 text-indigo-500" />
                    AI Career Pulse
                </h2>
                <CareerPulseWidget updates={careerUpdatesDB} showBdeOwner={true} />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Growth Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Revenue Growth (Last 6 Months)</h3>
                    <div className="h-72">
                        <AreaChart data={revenueData} />
                    </div>
                </div>

                {/* Team Leaderboard */}
                <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Team Leaderboard</h3>
                    <div className="space-y-4">
                        {topBDEs.map(bde => (
                            <div key={bde.name} className="flex items-center gap-4">
                                <img src={bde.avatar} alt={bde.name} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 text-sm">{bde.name}</p>
                                    <p className="text-xs text-slate-500">{bde.metric}</p>
                                </div>
                                <p className="font-semibold text-indigo-600">{bde.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <TaskTracker />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '700ms' }}>
                     <h3 className="text-xl font-bold text-slate-800 mb-4">High-Value Activity Feed</h3>
                     <ul className="space-y-3">
                        {activityFeed.map((activity, index) => (
                            <li key={index} className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg">
                                <p className="text-sm text-slate-700">{activity.text}</p>
                                <p className="text-xs text-slate-500 flex-shrink-0 ml-4 flex items-center gap-1.5">
                                    <ClockIcon className="w-3 h-3"/>
                                    {activity.time}
                                </p>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>

        </div>
    );
};

export default MasterDashboardPage;