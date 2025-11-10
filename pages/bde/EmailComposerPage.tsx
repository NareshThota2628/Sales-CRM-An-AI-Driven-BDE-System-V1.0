import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import SpinnerIcon from '../../components/icons/SpinnerIcon';
import ClipboardCopyIcon from '../../components/icons/ClipboardCopyIcon';
import SendIcon from '../../components/icons/SendIcon';
import { GoogleGenAI } from '@google/genai';

const tones = ['Professional', 'Casual', 'Persuasive', 'Friendly', 'Direct'];

const EmailComposerPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lead = location.state?.lead;

    const [prompt, setPrompt] = useState(lead ? `Write a follow-up email to ${lead.name} from ${lead.company}.` : '');
    const [tone, setTone] = useState('Professional');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
    const [copySuccess, setCopySuccess] = useState('');

    const handleGenerate = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!prompt) return;

        setIsGenerating(true);
        setGeneratedEmail(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const fullPrompt = `Based on the following prompt, generate a professional email. Use a ${tone} tone. The prompt is: "${prompt}". Return ONLY a valid JSON object with "subject" and "body" keys. The body should be a single string with newline characters (\\n) for paragraphs.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: 'application/json',
                }
            });
            
            const jsonText = response.text.replace(/```json\n?|\n?```/g, '');
            const emailData = JSON.parse(jsonText);
            setGeneratedEmail(emailData);

        } catch (error) {
            console.error("Email generation failed:", error);
            setGeneratedEmail({ subject: "Error", body: "Failed to generate email content. Please try again." });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        if (!generatedEmail) return;
        const fullEmail = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
        navigator.clipboard.writeText(fullEmail).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="animate-fade-in">
                <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                    <Link to="/bde/leads" className="hover:text-slate-800">Leads</Link>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-slate-800 font-semibold">AI Email Composer</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-800">Compose with AI</h1>
                <p className="text-slate-500 mt-1">Generate high-quality emails in seconds. Just provide a prompt and let AI do the rest.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Prompt Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <SparklesIcon className="w-6 h-6 text-indigo-500" />
                        Your AI Assistant
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-500 mb-2">Email Prompt</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={5}
                                placeholder="e.g., Write a brief, friendly follow-up email after a product demo."
                                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Select a Tone</label>
                            <div className="flex flex-wrap gap-2">
                                {tones.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${tone === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button className="w-full" onClick={handleGenerate} isLoading={isGenerating}>
                                Generate Email
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Generated Email Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Generated Email</h2>
                        {generatedEmail && (
                             <div className="flex items-center gap-2">
                                <Button variant="secondary" onClick={handleCopyToClipboard} leftIcon={<ClipboardCopyIcon className="w-4 h-4"/>}>
                                    {copySuccess || 'Copy'}
                                </Button>
                                <Button leftIcon={<SendIcon className="w-4 h-4"/>}>Send Email</Button>
                            </div>
                        )}
                    </div>
                    {isGenerating ? (
                         <div className="flex flex-col items-center justify-center h-64 text-center">
                            <SpinnerIcon className="w-8 h-8 text-indigo-500" />
                            <p className="mt-3 text-slate-500 font-medium">AI is writing your draft...</p>
                            <p className="text-sm text-slate-400">This should only take a moment.</p>
                        </div>
                    ) : generatedEmail ? (
                         <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm font-semibold text-slate-800">{generatedEmail.subject}</p>
                            </div>
                             <div className="p-3 bg-slate-50 rounded-lg whitespace-pre-wrap text-sm text-slate-700 h-64 overflow-y-auto">
                                {generatedEmail.body}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-lg">
                            <p className="text-slate-500 font-medium">Your generated email will appear here.</p>
                            <p className="text-sm text-slate-400">Provide a prompt and click "Generate".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailComposerPage;