import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import ConfidenceMeter from '../../components/ui/ConfidenceMeter';
import CheckCircle2Icon from '../../components/icons/CheckCircle2Icon';
import XCircleIcon from '../../components/icons/XCircleIcon';
import ClockIcon from '../../components/icons/ClockIcon';

const initialRequests = [
  { id: 1, bdeName: 'David Garcia', bdeAvatar: 'https://i.pravatar.cc/150?img=4', leadName: 'Solutions Inc.', companyName: 'Solutions Inc.', requestDate: '1 day ago', justification: 'Lead has confirmed budget and authority. They are looking to make a decision this quarter and have scheduled a technical demo. Strong fit for our enterprise package.', aiConfidence: 92, aiReasoning: 'High engagement score, positive sentiment in email communications, and matches ideal customer profile.' },
  { id: 2, bdeName: 'Amélie Laurent', bdeAvatar: 'https://i.pravatar.cc/150?img=1', leadName: 'Innovatech', companyName: 'Innovatech', requestDate: '3 days ago', justification: 'Innovatech is evaluating competitors, but our feature set aligns perfectly with their stated needs. The main contact, John Doe, is the key decision-maker.', aiConfidence: 85, aiReasoning: 'Lead matches 4/5 key buying signals. Some competitor risk detected.' },
  { id: 3, bdeName: 'François Lambert', bdeAvatar: 'https://i.pravatar.cc/150?img=6', leadName: 'FutureGadget', companyName: 'FutureGadget', requestDate: '5 days ago', justification: 'Early-stage interest but the lead is very enthusiastic. They have a clear pain point we can solve, but budget conversations have not yet happened.', aiConfidence: 68, aiReasoning: 'Positive intent but lacking budget confirmation and timeline. Qualifies as a strong prospect but conversion readiness is moderate.' },
];

const KpiCard: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p className="text-slate-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

const ConversionRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState(initialRequests);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAction = (id: number) => {
        setRequests(prev => prev.filter(req => req.id !== id));
    };

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Conversion Requests</h1>
                <p className="text-slate-500 mt-1">Review and approve lead conversion requests from your team.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <KpiCard title="Pending Requests" value={requests.length.toString()} />
                <KpiCard title="Approved this Week" value="28" />
                <KpiCard title="Avg. Approval Time" value="4.2 hours" />
            </section>

            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Pending Queue</h2>
                <div className="space-y-4">
                    {requests.map((req, index) => (
                        <div key={req.id} className="border border-slate-200 rounded-xl p-4 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${300 + index * 100}ms`}}>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <img src={req.bdeAvatar} alt={req.bdeName} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-slate-800">{req.leadName}</p>
                                        <p className="text-sm text-slate-500">Request from {req.bdeName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                        <ClockIcon className="w-4 h-4" />
                                        <span>{req.requestDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ConfidenceMeter score={req.aiConfidence} />
                                        <div className="text-left">
                                            <p className="font-bold text-slate-800">AI Confidence</p>
                                            <p className="text-xs text-slate-500">Conversion Readiness</p>
                                        </div>
                                    </div>
                                    {/* FIX: Set button size to 'sm' for a more compact UI inside the request row. */}
                                    <Button size="sm" variant="secondary" onClick={() => handleToggle(req.id)}>
                                        {expandedId === req.id ? 'Hide' : 'Review'}
                                    </Button>
                                </div>
                            </div>
                            {expandedId === req.id && (
                                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-fade-in" style={{ animationDuration: '0.3s' }}>
                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-1">BDE Justification:</h4>
                                        <p className="text-sm text-slate-600 pl-4 border-l-4 border-slate-200">{req.justification}</p>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold text-slate-700 mb-1">AI Reasoning:</h4>
                                        <p className="text-sm text-slate-600 pl-4 border-l-4 border-indigo-200">{req.aiReasoning}</p>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        {/* FIX: Set button size to 'sm' for a more compact UI inside the request row. */}
                                        <Button size="sm" onClick={() => handleAction(req.id)} variant="secondary" className="!border-red-300 !text-red-700 hover:!bg-red-100" leftIcon={<XCircleIcon className="w-5 h-5" />}>
                                            Reject
                                        </Button>
                                         {/* FIX: Set button size to 'sm' for a more compact UI inside the request row. */}
                                         <Button size="sm" onClick={() => handleAction(req.id)} className="!bg-green-600 hover:!bg-green-700 !shadow-green-500/30 !focus:ring-green-500" leftIcon={<CheckCircle2Icon className="w-5 h-5" />}>
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {requests.length === 0 && (
                        <div className="text-center py-12">
                            <p className="font-semibold text-slate-600">The approval queue is empty!</p>
                            <p className="text-slate-500">All conversion requests have been processed.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ConversionRequestsPage;
