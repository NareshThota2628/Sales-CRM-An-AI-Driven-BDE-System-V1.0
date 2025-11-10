import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import ShieldCheckIcon from '../../components/icons/ShieldCheckIcon';
import ShieldAlertIcon from '../../components/icons/ShieldAlertIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import CalendarIcon from '../../components/icons/CalendarIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import HandshakeIcon from '../../components/icons/HandshakeIcon';
import { getCompanyById, updateCompany, CompanyDetail, AccountHealth } from '../../components/data/companiesDB';
import { getActivityIcon, Activity, ActivityType } from '../../components/data/leadsDB';
import SpinnerIcon from '../../components/icons/SpinnerIcon';
import UsersIcon from '../../components/icons/UsersIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import FileTextIcon from '../../components/icons/FileTextIcon';
import TrendingUpIcon from '../../components/icons/TrendingUpIcon';
import TrendingDownIcon from '../../components/icons/TrendingDownIcon';


const healthStyles: Record<AccountHealth, { icon: React.ReactNode; text: string; bg: string; }> = {
  Healthy: { icon: <ShieldCheckIcon className="w-5 h-5 text-green-700" />, text: 'text-green-700', bg: 'bg-green-100' },
  'Needs Attention': { icon: <ShieldAlertIcon className="w-5 h-5 text-yellow-700" />, text: 'text-yellow-700', bg: 'bg-yellow-100' },
  'At Risk': { icon: <ShieldAlertIcon className="w-5 h-5 text-red-700" />, text: 'text-red-700', bg: 'bg-red-100' },
};

const Widget: React.FC<{ title: string; icon: React.ReactElement<{ className?: string }>; children: React.ReactNode; delay: number }> = ({ title, icon, children, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${delay}ms`}}>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            {React.cloneElement(icon, { className: 'w-5 h-5 text-slate-500' })}
            {title}
        </h2>
        {children}
    </div>
);

// FIX: Changed 'role' prop to 'title' to match the data structure from companiesDB.
const PersonCard: React.FC<{ name: string; title: string; avatar: string }> = ({ name, title, avatar }) => (
    <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
        <div>
            <p className="font-semibold text-slate-800 text-sm">{name}</p>
            <p className="text-xs text-slate-500">{title}</p>
        </div>
    </div>
);

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; delay: number }> = ({ icon, label, value, delay }) => (
    <div className="flex items-center gap-4 bg-slate-50/70 p-4 rounded-xl animate-fade-in" style={{ animationDelay: `${delay}ms`}}>
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0 shadow-sm">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{label}</p>
            <div className="font-semibold text-slate-800">{value}</div>
        </div>
    </div>
);


const CompanyDetailPage: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const navigate = useNavigate();
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [interactionType, setInteractionType] = useState<ActivityType>('note');
    const [noteContent, setNoteContent] = useState('');

    useEffect(() => {
        setIsLoading(true);
        const loadCompany = () => {
            if (companyId) {
                const companyData = getCompanyById(companyId);
                setCompany(companyData || null);
            }
            setIsLoading(false);
        };
        
        loadCompany();

        window.addEventListener('storage', loadCompany);
        return () => window.removeEventListener('storage', loadCompany);
    }, [companyId]);

    const handleUpdateCompany = (updatedCompany: CompanyDetail) => {
        setCompany(updatedCompany);
        updateCompany(updatedCompany);
    };

    const addActivity = (type: ActivityType, content: string) => {
        if (!company || !content.trim()) return;

        const newActivity: Activity = {
            id: `c-act-${Date.now()}`,
            type: type,
            content: content,
            author: 'Amélie Laurent', // Current user
            time: 'Just now',
        };

        const updatedCompany = {
            ...company,
            activity: [newActivity, ...company.activity],
        };
        handleUpdateCompany(updatedCompany);
    };

    const handleLogInteraction = (e: React.FormEvent) => {
        e.preventDefault();
        addActivity(interactionType, noteContent);
        setNoteContent('');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><SpinnerIcon className="w-8 h-8 text-indigo-500" /></div>;
    }

    if (!company) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-800">Company not found</h2>
                <p className="text-slate-500">The company you are looking for does not exist.</p>
                <Link to="/bde/companies"><Button className="mt-4">Back to Companies</Button></Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                        <Link to="/bde/companies" className="hover:text-slate-800">My Companies</Link>
                        <ChevronRightIcon className="w-4 h-4" />
                        <span className="text-slate-800 font-semibold">{company.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12" />
                        <h1 className="text-4xl font-bold text-slate-800">{company.name}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button leftIcon={<PlusIcon className="w-4 h-4"/>}>Create New Deal</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* Left Column */}
                <aside className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-3">About {company.name}</h3>
                        <p className="text-sm text-slate-600 border-l-4 border-indigo-200 pl-4">{company.description}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Company Vitals</h3>
                        <MetricCard icon={<DollarSignIcon className="w-5 h-5" />} label="Current ARR" value={`$${company.arr.toLocaleString()}`} delay={250} />
                        <MetricCard 
                            icon={healthStyles[company.health].icon} 
                            label="Account Health" 
                            value={<span className={`font-bold ${healthStyles[company.health].text}`}>{company.health}</span>} 
                            delay={300} 
                        />
                        <MetricCard icon={<CalendarIcon className="w-5 h-5" />} label="Converted On" value={company.conversionDate} delay={350} />
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Key Contacts</h3>
                        <div className="space-y-3">
                            {company.contacts.map(contact => (
                                <PersonCard key={contact.name} {...contact} />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Center Column */}
                <main className="lg:col-span-2 space-y-8">
                    <Widget title="Log Interaction" icon={<PlusIcon />} delay={250}>
                        <div className="flex gap-2 mb-4 border-b border-slate-200">
                           {(['note', 'call', 'meeting', 'email'] as ActivityType[]).map(type => (
                               <button key={type} onClick={() => setInteractionType(type)} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold capitalize border-b-2 ${interactionType === type ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                                   {getActivityIcon(type)} {type}
                               </button>
                           ))}
                        </div>
                        <form onSubmit={handleLogInteraction}>
                            <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder={`Add a ${interactionType} log...`} rows={4} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                            <Button className="w-full mt-4" type="submit" leftIcon={<PlusIcon className="w-4 h-4"/>}>Add to Timeline</Button>
                        </form>
                    </Widget>
                    <Widget title="Deal History" icon={<HandshakeIcon />} delay={300}>
                        <div className="space-y-2">
                           {company.deals.map(deal => (
                                <div key={deal.name} className="grid grid-cols-4 gap-4 items-center p-3 bg-slate-50 rounded-lg">
                                    <p className="col-span-2 font-semibold text-slate-700">{deal.name}</p>
                                    <p className="text-sm text-slate-600">{deal.stage}</p>
                                    <p className="text-sm font-semibold text-slate-800 text-right">${deal.amount.toLocaleString()}</p>
                                </div>
                           ))}
                        </div>
                    </Widget>
                    <Widget title="Activity Timeline" icon={<MessageSquareIcon />} delay={400}>
                         <div className="relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                            {company.activity.map((item, index) => (
                                <div key={item.id} className="relative mb-8">
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
                    </Widget>
                </main>
                
                {/* AI Insights Column */}
                <aside className="lg:col-span-3 xl:col-span-1">
                    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-2xl shadow-sm sticky top-8 animate-fade-in" style={{ animationDelay: '500ms' }}>
                         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-indigo-500" />
                            AI Growth Insights
                        </h3>
                        <div className="space-y-4">
                           {company.aiInsights.positive.length > 0 && (
                             <div>
                                <h4 className="font-semibold text-sm text-green-800 mb-2 flex items-center gap-1.5"><TrendingUpIcon className="w-4 h-4"/>Positive Signals</h4>
                                <div className="space-y-2">
                                    {company.aiInsights.positive.map((tip, index) => (
                                        <div key={`pos-${index}`} className="bg-green-100/70 p-3 rounded-lg">
                                            <p className="text-xs text-green-900">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                           )}
                           {company.aiInsights.negative.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm text-red-800 mb-2 flex items-center gap-1.5"><TrendingDownIcon className="w-4 h-4"/>Potential Risks</h4>
                                 <div className="space-y-2">
                                    {company.aiInsights.negative.map((tip, index) => (
                                        <div key={`neg-${index}`} className="bg-red-100/70 p-3 rounded-lg">
                                            <p className="text-xs text-red-900">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                           )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CompanyDetailPage;