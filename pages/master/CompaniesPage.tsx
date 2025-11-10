import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
import PlusIcon from '../../components/icons/PlusIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import ShieldCheckIcon from '../../components/icons/ShieldCheckIcon';
import ShieldAlertIcon from '../../components/icons/ShieldAlertIcon';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import BuildingsIcon from '../../components/icons/BuildingsIcon';
import TrendingUpIcon from '../../components/icons/TrendingUpIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import GridViewIcon from '../../components/icons/GridViewIcon';
import ListViewIcon from '../../components/icons/ListViewIcon';
import Button from '../../components/ui/Button';
import { getCompanies, CompanyDetail as Company, AccountHealth } from '../../components/data/companiesDB';
import AlertTriangleIcon from '../../components/icons/AlertTriangleIcon';


type AiInsightType = 'growth' | 'risk';
interface AiInsight {
    id: string;
    type: AiInsightType;
    title: string;
    description: string;
    companyId: string;
    companyName: string;
}

// Mock Data
const aiInsightsData: AiInsight[] = [];


// Style Mappings & Components
const healthStyles: Record<AccountHealth, { icon: React.ReactNode; text: string; bg: string; border: string; }> = {
  Healthy: { icon: <ShieldCheckIcon className="w-4 h-4 text-green-700" />, text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300' },
  'Needs Attention': { icon: <ShieldAlertIcon className="w-4 h-4 text-yellow-700" />, text: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-300' },
  'At Risk': { icon: <AlertTriangleIcon className="w-4 h-4 text-red-700" />, text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300' },
};
const allHealths: AccountHealth[] = ['Healthy', 'Needs Attention', 'At Risk'];

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-5">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const AiInsightCard: React.FC<{ insight: AiInsight }> = ({ insight }) => {
    const isGrowth = insight.type === 'growth';
    const icon = isGrowth ? <TrendingUpIcon className="w-5 h-5" /> : <AlertTriangleIcon className="w-5 h-5" />;
    const color = isGrowth ? 'green' : 'red';
    const navigate = useNavigate();

    return (
        <div className={`w-72 flex-shrink-0 p-4 rounded-xl border-l-4 ${isGrowth ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
            <div className={`flex items-center gap-2 font-bold text-sm ${isGrowth ? 'text-green-800' : 'text-red-800'}`}>
                {icon}
                {insight.title}
            </div>
            <p className={`text-xs mt-2 ${isGrowth ? 'text-green-700' : 'text-red-700'}`}>{insight.description}</p>
            <div className="mt-3 text-right">
                <Button onClick={() => navigate(`/bde/companies/${insight.companyId}`)} size="sm" variant="secondary" className="!text-xs">
                    View {insight.companyName}
                </Button>
            </div>
        </div>
    );
};

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
    const navigate = useNavigate();
    const healthStyle = healthStyles[company.health];
    return (
        <div 
            onClick={() => navigate(`/bde/companies/${company.id}`)}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <img src={company.logo} alt={`${company.name} logo`} className="w-10 h-10" />
                    <div>
                        <h3 className="font-bold text-slate-800">{company.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{company.description}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${healthStyle.bg} ${healthStyle.text}`}>
                    {healthStyle.icon}
                    {company.healthScore}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="text-xs text-slate-500">ARR</p>
                    <p className="font-semibold text-slate-800">${company.arr.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-500">Owner</p>
                    <p className="font-semibold text-slate-800 truncate">{company.owner.name}</p>
                </div>
                 <div>
                    <p className="text-xs text-slate-500">Open Deals</p>
                    <p className="font-semibold text-slate-800">{company.openDeals}</p>
                </div>
            </div>
        </div>
    );
};

const CompanyRow: React.FC<{ company: Company }> = ({ company }) => {
    const navigate = useNavigate();
    const healthStyle = healthStyles[company.health];
    return (
        <tr onClick={() => navigate(`/bde/companies/${company.id}`)} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <img src={company.logo} alt={company.name} className="w-8 h-8"/>
                    <span className="font-bold text-slate-800">{company.name}</span>
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${healthStyle.bg.replace('bg-', 'bg-').replace('-100', '-500')}`} />
                    <span className="font-semibold text-slate-700">{company.healthScore}</span>
                </div>
            </td>
            <td className="px-4 py-3 font-semibold text-slate-700 text-right">${company.arr.toLocaleString()}</td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <img src={company.owner.avatar} alt={company.owner.name} className="w-7 h-7 rounded-full"/>
                    <span className="font-medium text-slate-600">{company.owner.name}</span>
                </div>
            </td>
            <td className="px-4 py-3 font-semibold text-slate-700 text-center">{company.openDeals}</td>
            <td className="px-4 py-3 text-slate-500">{company.lastActivity}</td>
        </tr>
    );
};


const MasterCompaniesPage: React.FC = () => {
    const navigate = useNavigate();
    const [companiesData, setCompaniesData] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [healthFilter, setHealthFilter] = useState<AccountHealth | 'All'>('All');
    const [view, setView] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const loadData = () => {
            // Master view shows ALL companies
            setCompaniesData(getCompanies());
        };
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);
    }, []);
    
    const kpiValues = useMemo(() => {
        if (companiesData.length === 0) {
            return { totalArr: 0, avgHealth: 0, atRiskCount: 0, growthOpportunities: 0 };
        }
        const totalArr = companiesData.reduce((sum, c) => sum + c.arr, 0);
        const avgHealth = companiesData.reduce((sum, c) => sum + c.healthScore, 0) / companiesData.length;
        const atRiskCount = companiesData.filter(c => c.health === 'At Risk').length;
        return { totalArr, avgHealth, atRiskCount, growthOpportunities: aiInsightsData.filter(i => i.type === 'growth').length };
    }, [companiesData]);

    const filteredCompanies = useMemo(() => {
        return companiesData.filter(company =>
            (company.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (healthFilter === 'All' || company.health === healthFilter)
        );
    }, [companiesData, searchTerm, healthFilter]);

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Company Portfolio</h1>
                    <p className="text-slate-500 mt-1">Manage and analyze all company accounts across the organization.</p>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <KpiCard title="Portfolio ARR" value={`$${(kpiValues.totalArr / 1000).toFixed(0)}k`} icon={<DollarSignIcon className="w-6 h-6 text-green-600"/>} color="bg-green-100" />
                <KpiCard title="Avg. Health Score" value={kpiValues.avgHealth.toFixed(0)} icon={<ShieldCheckIcon className="w-6 h-6 text-indigo-600"/>} color="bg-indigo-100" />
                <KpiCard title="At-Risk Accounts" value={kpiValues.atRiskCount.toString()} icon={<AlertTriangleIcon className="w-6 h-6 text-red-600"/>} color="bg-red-100" />
                <KpiCard title="Growth Signals" value={kpiValues.growthOpportunities.toString()} icon={<TrendingUpIcon className="w-6 h-6 text-blue-600"/>} color="bg-blue-100" />
            </section>
            
             <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-indigo-500" />
                    AI Opportunity Radar
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {aiInsightsData.map(insight => <AiInsightCard key={insight.id} insight={insight} />)}
                </div>
            </section>

            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input type="text" placeholder="Search companies..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-50 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <select onChange={e => setHealthFilter(e.target.value as any)} value={healthFilter} className="bg-slate-50 border-transparent rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500">
                            <option value="All">All Health</option>
                            {allHealths.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}><GridViewIcon className="w-5 h-5 text-slate-600"/></button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-white shadow-sm' : ''}`}><ListViewIcon className="w-5 h-5 text-slate-600"/></button>
                    </div>
                </div>

                {view === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company) => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Company</th>
                                    <th className="px-4 py-3">Health Score</th>
                                    <th className="px-4 py-3 text-right">ARR</th>
                                    <th className="px-4 py-3">BDE Owner</th>
                                    <th className="px-4 py-3 text-center">Open Deals</th>
                                    <th className="px-4 py-3">Last Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCompanies.map(company => <CompanyRow key={company.id} company={company} />)}
                            </tbody>
                        </table>
                    </div>
                )}

                 {filteredCompanies.length === 0 && (
                    <div className="text-center py-16">
                        <p className="font-semibold text-slate-600">No companies match your criteria.</p>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MasterCompaniesPage;