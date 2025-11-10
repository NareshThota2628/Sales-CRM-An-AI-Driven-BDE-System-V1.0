import React, { useState, useMemo } from 'react';
import FunnelChart from '../../components/charts/FunnelChart';
import RadialBarChart from '../../components/charts/RadialBarChart';
import ScatterPlotChart from '../../components/charts/ScatterPlotChart';
import BarLineChart from '../../components/charts/BarLineChart';

// Mock Data
const funnelData: { stage: string; value: number }[] = [];

const revenueData: { name: string; monthly: number; cumulative: number }[] = [];

const leadSourceData: { name: string; value: number; color: string }[] = [];

const scatterData: { name: string; conversionRate: number; closedARR: number; leads: number }[] = [];

const aiEfficacyData = {
    labels: ['Hot', 'Warm', 'Cold'],
    datasets: [{
        label: 'Conversion Rate',
        data: [],
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6'],
    }],
};

// Reusable Chart Wrapper
const ChartWrapper: React.FC<{ title: string; children: React.ReactNode; className?: string; delay: number }> = ({ title, children, className, delay }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm animate-fade-in ${className}`} style={{ animationDelay: `${delay}ms`}}>
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        <div className="h-72">{children}</div>
    </div>
);

// Main Page Component
const MasterAnalyticsPage: React.FC = () => {
    const [timeRange, setTimeRange] = useState('Last 90 Days');
    const [teamMember, setTeamMember] = useState('All Members');

    const filteredData = useMemo(() => {
        // Time Range Filtering for revenueData
        let revenueSlice = revenueData;
        if (timeRange === 'Last 90 Days') {
            revenueSlice = revenueData.slice(-3);
        } else if (timeRange === 'Last 30 Days') {
            revenueSlice = revenueData.slice(-2);
        } else if (timeRange === 'This Quarter') {
            revenueSlice = revenueData.slice(-3);
        }

        const isIndividualView = teamMember !== 'All Members';
        const numBDEs = scatterData.length;

        const scatter = isIndividualView 
            ? scatterData.filter(d => d.name === teamMember) 
            : scatterData;
        
        const funnel = isIndividualView
            ? funnelData.map(d => ({ ...d, value: Math.round(d.value / numBDEs * 1.2) }))
            : funnelData;

        const revenue = isIndividualView
            ? revenueSlice.map(d => ({ ...d, monthly: Math.round(d.monthly / numBDEs), cumulative: Math.round(d.cumulative / numBDEs) }))
            : revenueSlice;

        const leadSource = isIndividualView
            ? leadSourceData.map(d => ({ ...d, value: Math.max(5, d.value - 15) }))
            : leadSourceData;

        const aiEfficacy = {
            ...aiEfficacyData,
            datasets: [{
                ...aiEfficacyData.datasets[0],
                data: isIndividualView ? [55, 25, 3] : [45, 18, 5]
            }]
        };

        return { funnel, revenue, leadSource, aiEfficacy, scatter };

    }, [timeRange, teamMember]);

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Team Analytics</h1>
                <p className="text-slate-500 mt-1">Data-driven insights for strategic decision-making.</p>
            </header>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-slate-600">Time Range:</label>
                    <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 p-2">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Quarter</option>
                        <option>Last 6 Months</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-slate-600">Team Member:</label>
                     <select value={teamMember} onChange={e => setTeamMember(e.target.value)} className="bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 p-2">
                        <option>All Members</option>
                        {scatterData.map(d => <option key={d.name}>{d.name}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartWrapper title="Lead Performance Funnel" delay={200}>
                    <FunnelChart data={filteredData.funnel} key={`funnel-${timeRange}-${teamMember}`} />
                </ChartWrapper>
                <ChartWrapper title="Closed ARR Over Time (in thousands)" delay={300}>
                    <BarLineChart data={filteredData.revenue} key={`barline-${timeRange}-${teamMember}`} />
                </ChartWrapper>
                <ChartWrapper title="Lead Source Effectiveness" delay={400}>
                    <RadialBarChart data={filteredData.leadSource} key={`radial-${timeRange}-${teamMember}`} />
                </ChartWrapper>
                <ChartWrapper title="AI Score Efficacy" delay={500}>
                    <div className="w-full h-full flex justify-around items-end px-4">
                        {filteredData.aiEfficacy.labels.map((label, i) => (
                            <div key={label} className="flex flex-col items-center">
                                <div className="text-lg font-bold text-slate-700">{filteredData.aiEfficacy.datasets[0].data[i]}%</div>
                                <div 
                                    key={`bar-${timeRange}-${teamMember}-${i}`}
                                    className="w-16 rounded-t-md transition-all duration-1000"
                                    style={{ 
                                        height: `${filteredData.aiEfficacy.datasets[0].data[i] * 4}px`,
                                        backgroundColor: filteredData.aiEfficacy.datasets[0].backgroundColor[i],
                                        animation: `bar-up 1s ${i * 0.1}s ease-out forwards`,
                                        transformOrigin: 'bottom'
                                    }}
                                ></div>
                                <div className="mt-2 text-sm font-semibold text-slate-600">{label}</div>
                            </div>
                        ))}
                    </div>
                </ChartWrapper>
                <ChartWrapper title="BDE Performance Matrix" delay={600} className="lg:col-span-2">
                    <ScatterPlotChart data={filteredData.scatter} key={`scatter-${timeRange}-${teamMember}`} />
                </ChartWrapper>
            </div>
             <style>{`
                @keyframes bar-up {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
};

export default MasterAnalyticsPage;