import React from 'react';
import SparklesIcon from '../icons/SparklesIcon';
import LightbulbIcon from '../icons/LightbulbIcon';
import AlertTriangleIcon from '../icons/AlertTriangleIcon';

interface AIInsightsCardProps {
  insights: {
    summary: string;
    talkingPoints: string[];
    risks: string[];
  };
}

const AIInsightsCard: React.FC<AIInsightsCardProps> = ({ insights }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-indigo-500" />
                AI Insights
            </h3>
            <div className="space-y-4">
                <div className="bg-indigo-50/70 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm text-indigo-800 mb-1">Summary</h4>
                    <p className="text-xs text-indigo-700">{insights.summary}</p>
                </div>
                <div className="bg-green-50/70 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm text-green-800 mb-2 flex items-center gap-1.5"><LightbulbIcon className="w-4 h-4"/>Talking Points</h4>
                    <ul className="list-disc list-inside text-xs text-green-700 space-y-1">
                        {insights.talkingPoints.map((point, i) => <li key={i}>{point}</li>)}
                    </ul>
                </div>
                <div className="bg-red-50/70 p-3 rounded-lg">
                    <h4 className="font-semibold text-sm text-red-800 mb-2 flex items-center gap-1.5"><AlertTriangleIcon className="w-4 h-4"/>Potential Risks</h4>
                    <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                        {insights.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};




export default AIInsightsCard;