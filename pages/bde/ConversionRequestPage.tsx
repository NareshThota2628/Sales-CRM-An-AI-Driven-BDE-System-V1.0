import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import SendIcon from '../../components/icons/SendIcon';
import FilePlusIcon from '../../components/icons/FilePlusIcon';

// Mock data (in a real app, this would come from a context or API)
const leadsData = [
  { id: 'lead-1', name: 'John Doe', company: 'Innovatech' },
  { id: 'lead-2', name: 'Jane Smith', company: 'Solutions Inc.' },
  { id: 'lead-3', name: 'Sam Wilson', company: 'DataCorp' },
  { id: 'lead-4', name: 'Patricia Williams', company: 'FutureGadget' },
  { id: 'lead-5', name: 'Michael Brown', company: 'Synergy LLC' },
  { id: 'lead-6', name: 'Linda Davis', company: 'Quantum Leap' },
  { id: 'lead-7', name: 'James Miller', company: 'NextGen AI' },
];

const ConversionRequestPage: React.FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const lead = leadsData.find(l => l.id === leadId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call to submit the request
        console.log('Conversion request submitted for lead:', leadId);
        // Navigate back to the leads page or a success page
        navigate('/bde/leads');
    };

    if (!lead) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-800">Lead not found</h2>
                <Link to="/bde/leads"><Button className="mt-4">Back to Leads</Button></Link>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="animate-fade-in">
                <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                    <Link to="/bde/leads" className="hover:text-slate-800">Leads</Link>
                    <ChevronRightIcon className="w-4 h-4" />
                    <Link to={`/bde/leads/${lead.id}`} className="hover:text-slate-800">{lead.name}</Link>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-slate-800 font-semibold">Conversion Request</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-800">Request Lead Conversion</h1>
                <p className="text-slate-500 mt-1">
                    Formalize the hand-off for <span className="font-semibold text-slate-600">{lead.name}</span> at <span className="font-semibold text-slate-600">{lead.company}</span>.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="space-y-8">
                    <div>
                        <label htmlFor="summary" className="block text-lg font-semibold text-slate-800 mb-2">Summary of Qualification</label>
                        <p className="text-sm text-slate-500 mb-3">Briefly explain why this lead is ready for the next stage. Mention key pain points and our proposed solution.</p>
                        <textarea
                            id="summary"
                            rows={5}
                            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., John is the VP of Engineering and is actively looking for a solution to streamline their data analytics pipeline. He has budget approval and is aiming for a Q4 implementation..."
                        />
                    </div>

                    <div>
                        <label htmlFor="stakeholders" className="block text-lg font-semibold text-slate-800 mb-2">Key Stakeholders</label>
                        <p className="text-sm text-slate-500 mb-3">List the primary contacts, their roles, and any notes on their involvement.</p>
                        <textarea
                            id="stakeholders"
                            rows={4}
                            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., - John Doe (VP of Engineering) - Main decision maker.&#x0a;- Sarah Jenkins (Project Manager) - Will lead implementation."
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="notes" className="block text-lg font-semibold text-slate-800 mb-2">Final Notes & Next Steps</label>
                        <p className="text-sm text-slate-500 mb-3">Add any final context for the account executive and suggest immediate next steps.</p>
                        <textarea
                            id="notes"
                            rows={4}
                            className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., The team is very receptive. I suggest scheduling a technical deep-dive with an SE within the next week. I've attached the initial discovery call notes."
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold text-slate-800 mb-2">Attachments</label>
                         <div className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
                            <div>
                                <p className="text-slate-500 mb-2">Drag & drop files or</p>
                                <Button type="button" variant="secondary" leftIcon={<FilePlusIcon className="w-4 h-4"/>}>
                                    Browse Files
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end items-center gap-4">
                        <Button type="button" variant="secondary" onClick={() => navigate(`/bde/leads/${lead.id}`)}>Cancel</Button>
                        <Button type="submit" leftIcon={<SendIcon className="w-4 h-4" />}>Submit Conversion Request</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ConversionRequestPage;
