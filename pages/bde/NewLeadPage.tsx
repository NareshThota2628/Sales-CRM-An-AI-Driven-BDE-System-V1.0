import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import UserIcon from '../../components/icons/UserIcon';
import MailIcon from '../../components/icons/MailIcon';
import BriefcaseIcon from '../../components/icons/BriefcaseIcon';
import BuildingIcon from '../../components/icons/BuildingIcon';
import GlobeIcon from '../../components/icons/GlobeIcon';
import ZapIcon from '../../components/icons/ZapIcon';
import SpinnerIcon from '../../components/icons/SpinnerIcon';
import PhoneIcon from '../../components/icons/PhoneIcon';
import LinkedinIcon from '../../components/icons/LinkedinIcon';
import MapPinIcon from '../../components/icons/MapPinIcon';
import { addLead, checkDuplicateEmail, checkDuplicateWebsite } from '../../components/data/leadsDB';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';
import XCircleIcon from '../../components/icons/XCircleIcon';

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Unqualified' | 'Closed';
const allStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Unqualified', 'Closed'];

type LeadSource = 'Webinar' | 'Cold Call' | 'Referral' | 'Website' | 'Advertisement' | 'Other';
const allSources: LeadSource[] = ['Webinar', 'Cold Call', 'Referral', 'Website', 'Advertisement', 'Other'];

type ValidationStatus = 'idle' | 'checking' | 'valid' | 'invalid';
interface ValidationState {
    status: ValidationStatus;
    message: string;
}

const NewLeadPage: React.FC = () => {
    const navigate = useNavigate();
    const [isEnriching, setIsEnriching] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [enrichedData, setEnrichedData] = useState<{
        name: string;
        logo: string;
        description: string;
        tags: string[];
    } | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [designation, setDesignation] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState<LeadStatus>('New');
    const [source, setSource] = useState<LeadSource>('Website');
    const [notes, setNotes] = useState('');

    // Validation states
    const [emailValidation, setEmailValidation] = useState<ValidationState>({ status: 'idle', message: '' });
    const [websiteValidation, setWebsiteValidation] = useState<ValidationState>({ status: 'idle', message: '' });

    const handleEmailBlur = async () => {
        if (!email.trim()) {
            setEmailValidation({ status: 'idle', message: '' });
            return;
        }
        setEmailValidation({ status: 'checking', message: '' });
        await new Promise(res => setTimeout(res, 500)); // Simulate network latency
        const duplicate = checkDuplicateEmail(email);
        if (duplicate) {
            setEmailValidation({ status: 'invalid', message: `A lead named '${duplicate.name}' already exists with this email.` });
        } else {
            setEmailValidation({ status: 'valid', message: '' });
        }
    };

    const handleWebsiteBlur = async () => {
        if (!websiteUrl.trim()) {
            setWebsiteValidation({ status: 'idle', message: '' });
            return;
        }
        setWebsiteValidation({ status: 'checking', message: '' });
        await new Promise(res => setTimeout(res, 500)); // Simulate network latency
        const duplicate = checkDuplicateWebsite(websiteUrl);
        if (duplicate) {
            setWebsiteValidation({ status: 'invalid', message: `A company named '${duplicate.company}' is already registered with this website.` });
        } else {
            setWebsiteValidation({ status: 'valid', message: '' });
        }
    };

    const handleEnrich = async (e: React.MouseEvent) => {
        e.preventDefault();
        await handleWebsiteBlur(); // Run validation before enriching
        if (websiteValidation.status === 'invalid' || !websiteUrl) return;

        setIsEnriching(true);
        setShowInsights(true);
        setEnrichedData(null);

        // Simulate AI call
        setTimeout(() => {
            const enriched = {
                name: 'Innovatech',
                logo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600',
                description: 'A leading provider of enterprise SaaS solutions, specializing in cloud-based analytics and business intelligence.',
                tags: ['SaaS', 'Analytics', 'B2B', 'Cloud Services'],
            };
            setEnrichedData(enriched);
            setCompanyName(enriched.name); // Pre-fill form
            setIsEnriching(false);
        }, 1500);
    };
    
    const handleSaveLead = (e: React.FormEvent) => {
        e.preventDefault();
        if (emailValidation.status === 'invalid' || websiteValidation.status === 'invalid' || !name || !email) return;
        
        addLead({
            name, email, phone, designation, linkedin, status, source, notes,
            company: companyName,
            website: websiteUrl,
            location,
            value: 0, // Default value for new lead
            assignedTo: '1', // Hardcode current user for demo
            assignedToName: 'Amélie Laurent',
            companyLogo: enrichedData?.logo || `https://ui-avatars.com/api/?name=${companyName.replace(/ /g, '+')}&color=7F9CF5&background=EBF4FF`,
        });

        navigate('/bde/leads');
    };

    const getValidationIcon = (status: ValidationStatus) => {
        switch (status) {
            case 'checking':
                return <SpinnerIcon className="w-5 h-5" />;
            case 'valid':
                return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'invalid':
                return <XCircleIcon className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const isSaveDisabled = emailValidation.status === 'invalid' || websiteValidation.status === 'invalid' || emailValidation.status === 'checking' || websiteValidation.status === 'checking' || !name || !email;


    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="animate-fade-in">
                <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                    <Link to="/bde/leads" className="hover:text-slate-800">Leads</Link>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-slate-800 font-semibold">Add New Lead</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-800">Capture a New Lead</h1>
                <p className="text-slate-500 mt-1">Fill in the details below. Use the AI assistant to enrich company data instantly.</p>
            </header>

            <form onSubmit={handleSaveLead} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Fields */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm space-y-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Contact Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Contact Name" id="contact-name" type="text" placeholder="e.g., John Doe" icon={<UserIcon className="w-5 h-5 text-gray-400" />} value={name} onChange={e => setName(e.target.value)} required />
                            <Input label="Email Address" id="email" type="email" placeholder="e.g., john.doe@company.com" icon={<MailIcon className="w-5 h-5 text-gray-400" />} value={email} onChange={e => setEmail(e.target.value)} onBlur={handleEmailBlur} rightIcon={getValidationIcon(emailValidation.status)} error={emailValidation.message} required />
                            <Input label="Phone Number" id="phone" type="tel" placeholder="e.g., 555-123-4567" icon={<PhoneIcon className="w-5 h-5 text-gray-400" />} value={phone} onChange={e => setPhone(e.target.value)} />
                            <Input label="Designation" id="designation" type="text" placeholder="e.g., Head of Sales" icon={<BriefcaseIcon className="w-5 h-5 text-gray-400" />} value={designation} onChange={e => setDesignation(e.target.value)} />
                        </div>
                         <div className="mt-6">
                            <Input label="LinkedIn Profile" id="linkedin" type="text" placeholder="e.g., linkedin.com/in/johndoe" icon={<LinkedinIcon className="w-5 h-5 text-gray-400" />} value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                        </div>
                    </section>
                     <section>
                        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Company Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <Input label="Company Name" id="company-name" type="text" placeholder="e.g., Innovatech" icon={<BuildingIcon className="w-5 h-5 text-gray-400" />} value={companyName} onChange={e => setCompanyName(e.target.value)} />
                             <Input label="Location" id="location" type="text" placeholder="e.g., San Francisco, CA" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                        <div className="mt-6">
                            <label htmlFor="website" className="block text-sm font-medium text-gray-500 mb-2">Company Website</label>
                            <div className="flex items-start gap-2">
                                <div className="flex-grow">
                                    <Input
                                        label=""
                                        id="website"
                                        type="text"
                                        placeholder="e.g., www.innovatech.com"
                                        icon={<GlobeIcon className="w-5 h-5 text-gray-400" />}
                                        value={websiteUrl}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                        onBlur={handleWebsiteBlur}
                                        rightIcon={getValidationIcon(websiteValidation.status)}
                                        error={websiteValidation.message}
                                    />
                                </div>
                                <Button type="button" variant="secondary" onClick={handleEnrich} isLoading={isEnriching} className="!py-4 !px-6 !rounded-full shrink-0"><ZapIcon className="w-5 h-5 mr-2" />AI Insights</Button>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-6">Lead Status & Notes</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-500 mb-2">Status</label>
                                <select id="status" value={status} onChange={e => setStatus(e.target.value as LeadStatus)} className="w-full py-4 px-6 bg-gray-100/60 rounded-full text-gray-800 border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white">
                                    {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                             <div>
                                <label htmlFor="source" className="block text-sm font-medium text-gray-500 mb-2">Source</label>
                                <select id="source" value={source} onChange={e => setSource(e.target.value as LeadSource)} className="w-full py-4 px-6 bg-gray-100/60 rounded-full text-gray-800 border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white">
                                    {allSources.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                        </div>
                        <div className="mt-6">
                             <label htmlFor="notes" className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
                             <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="w-full p-4 bg-gray-100/60 rounded-2xl text-gray-800 placeholder-gray-400 border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white" placeholder="Add any relevant notes, call logs, or context here..."></textarea>
                        </div>
                    </section>
                    <div className="pt-4 text-right">
                        <Button type="submit" disabled={isSaveDisabled}>Save Lead</Button>
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="lg:col-span-1">
                    {showInsights && (
                        <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><ZapIcon className="w-5 h-5 text-indigo-500" />AI Insights</h3>
                            {isEnriching ? (
                                <div className="flex flex-col items-center justify-center h-48"><SpinnerIcon className="w-8 h-8 text-indigo-500" /><p className="mt-3 text-slate-500 font-medium">Analyzing website...</p></div>
                            ) : enrichedData && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4"><img src={enrichedData.logo} alt="Company Logo" className="w-14 h-14" /><h4 className="text-lg font-bold text-slate-800">{enrichedData.name}</h4></div>
                                    <p className="text-sm text-slate-600 border-l-4 border-indigo-200 pl-4">{enrichedData.description}</p>
                                    <div>
                                        <h5 className="font-semibold text-slate-700 mb-2">Industry Tags:</h5>
                                        <div className="flex flex-wrap gap-2">{enrichedData.tags.map(tag => (<span key={tag} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">{tag}</span>))}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default NewLeadPage;