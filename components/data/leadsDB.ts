import { LeadStatus } from '../../types';
import React from 'react';

// --- ICONS (included here for simplicity to avoid creating many new files) ---
import StickyNoteIcon from '../icons/StickyNoteIcon';
import PhoneIcon from '../icons/PhoneIcon';
import VideoIcon from '../icons/VideoIcon';
import MailIcon from '../icons/MailIcon';
import ArrowRightLeftIcon from '../icons/ArrowRightLeftIcon';


// --- TYPES ---

export type ActivityType = 'note' | 'call' | 'meeting' | 'email' | 'status_change';

export interface Activity {
  id: string;
  type: ActivityType;
  content: string;
  author: string; // 'System' for automated entries
  time: string; // e.g., "2 hours ago"
}

export interface LeadDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  linkedin: string;
  linkedinUrl?: string;
  location: string;
  company: string;
  website?: string;
  companyLogo: string;
  status: LeadStatus;
  value: number;
  source: string;
  assignedTo: string;
  assignedToName: string;
  notes?: string;
  activity: Activity[];
  aiInsights: {
    summary: string;
    talkingPoints: string[];
    risks: string[];
  };
  related?: {
    contacts: { name: string; title: string; avatar: string }[],
    deals: { name: string; stage: string; amount: number }[]
  }
}

export const getActivityIcon = (type: ActivityType): React.ReactNode => {
    // FIX: Replaced JSX syntax with React.createElement to resolve parsing errors in a .ts file.
    // The TypeScript compiler was misinterpreting the '<' and '>' of JSX as operators.
    switch (type) {        
        case 'note': return React.createElement(StickyNoteIcon, { className: "w-5 h-5 text-yellow-600" });
        case 'call': return React.createElement(PhoneIcon, { className: "w-5 h-5 text-blue-600" });
        case 'meeting': return React.createElement(VideoIcon, { className: "w-5 h-5 text-purple-600" });
        case 'email': return React.createElement(MailIcon, { className: "w-5 h-5 text-slate-500" });
        case 'status_change': return React.createElement(ArrowRightLeftIcon, { className: "w-5 h-5 text-orange-600" });
        default: return React.createElement(StickyNoteIcon, { className: "w-5 h-5 text-slate-500" });
    }
}


const LEADS_DB_KEY = 'crm_leads_data_v2';

const initialLeadsData: LeadDetail[] = [
  { 
    id: 'lead-1', 
    name: 'John Doe', 
    email: 'john.doe@innovatech.com',
    phone: '555-123-4567',
    designation: 'VP of Engineering',
    linkedin: 'linkedin.com/in/johndoe',
    linkedinUrl: 'https://www.linkedin.com/in/johndoe',
    location: 'San Francisco, CA',
    company: 'Innovatech', 
    website: 'innovatech.com',
    companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', 
    status: 'Qualified', 
    value: 50000, 
    source: 'Webinar', 
    assignedTo: '1', 
    assignedToName: 'Amélie Laurent',
    activity: [
        { id: 'act-1-1', type: 'email', content: 'Opened initial outreach email. Clicked on pricing link.', author: 'System', time: '5 days ago' },
        { id: 'act-1-2', type: 'meeting', content: 'Scheduled a product demo for next Tuesday at 10 AM PST.', author: 'John Doe', time: '3 days ago' },
        { id: 'act-1-3', type: 'call', content: 'Initial discovery call. Good fit, interested in AI analytics features.', author: 'Amélie Laurent', time: '1 day ago' },
        { id: 'act-1-4', type: 'note', content: 'Discussed pricing models and potential for a Q4 start. Sent over the enterprise package details.', author: 'Amélie Laurent', time: '2 hours ago' },
    ],
    aiInsights: {
        summary: "Highly engaged lead with clear authority. Focus on demonstrating ROI and seamless integration.",
        talkingPoints: [
            "Mention their recent Series B funding round.",
            "Highlight how AI analytics can reduce their team's manual workload.",
            "Reference their competitor (DataCorp) who uses a similar solution."
        ],
        risks: [
            "Expressed concern about implementation time.",
            "Has a prior relationship with a competing vendor."
        ]
    },
    related: {
        contacts: [{ name: 'Sarah Jenkins', title: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=12' }],
        deals: [{ name: 'Enterprise License Q3', stage: 'Negotiation', amount: 50000 }]
    }
  },
  { id: 'lead-2', name: 'Jane Smith', email: 'jane.s@solutions.com', phone: '555-5678', designation: 'Product Manager', linkedin: 'linkedin.com/in/janesmith', linkedinUrl: 'https://www.linkedin.com/in/janesmith', location: 'New York, NY', company: 'Solutions Inc.', website: 'solutions.com', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500', status: 'New', value: 75000, source: 'Referral', assignedTo: '2', assignedToName: 'Benoît Dubois', activity: [], aiInsights: { summary: '', talkingPoints:[], risks:[] } },
  { id: 'lead-3', name: 'Sam Wilson', email: 'sam.wilson@datacorp.co', phone: '555-8765', designation: 'Data Scientist', linkedin: 'linkedin.com/in/samwilson', linkedinUrl: 'https://www.linkedin.com/in/samwilson', location: 'Austin, TX', company: 'DataCorp', website: 'datacorp.co', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500', status: 'Contacted', value: 20000, source: 'Website', assignedTo: '1', assignedToName: 'Amélie Laurent', activity: [], aiInsights: { summary: '', talkingPoints:[], risks:[] } },
  { id: 'lead-4', name: 'Patricia Williams', email: 'pat.w@futuregadget.io', phone: '555-4321', designation: 'CEO', linkedin: 'linkedin.com/in/patriciaw', linkedinUrl: 'https://www.linkedin.com/in/patriciaw', location: 'Boston, MA', company: 'FutureGadget', website: 'futuregadget.io', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=500', status: 'New', value: 5000, source: 'Cold Call', assignedTo: '3', assignedToName: 'Chloé Martin', activity: [], aiInsights: { summary: '', talkingPoints:[], risks:[] } },
  { id: 'lead-5', name: 'Michael Brown', email: 'm.brown@synergy.llc', phone: '555-3456', designation: 'Operations Manager', linkedin: 'linkedin.com/in/michaelbrown', linkedinUrl: 'https://www.linkedin.com/in/michaelbrown', location: 'Chicago, IL', company: 'Synergy LLC', website: 'synergy.llc', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500', status: 'Unqualified', value: 10000, source: 'Advertisement', assignedTo: '2', assignedToName: 'Benoît Dubois', activity: [], aiInsights: { summary: '', talkingPoints:[], risks:[] } },
  { id: 'lead-6', name: 'Linda Davis', email: 'linda.d@quantum.ai', phone: '555-6789', designation: 'CTO', linkedin: 'linkedin.com/in/lindadavis', linkedinUrl: 'https://www.linkedin.com/in/lindadavis', location: 'San Francisco, CA', company: 'Quantum Leap', website: 'quantum.ai', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500', status: 'Closed', value: 120000, source: 'Referral', assignedTo: '1', assignedToName: 'Amélie Laurent', activity: [], aiInsights: { summary: '', talkingPoints:[], risks:[] } },
  { id: 'lead-7', name: 'James Miller', email: 'j.miller@nextgen.ai', phone: '555-9876', designation: 'Lead Developer', linkedin: 'linkedin.com/in/jamesmiller', linkedinUrl: 'https://www.linkedin.com/in/jamesmiller', location: 'Seattle, WA', company: 'NextGen AI', website: 'nextgen.ai', companyLogo: 'https://tailwindui.com/img/logos/mark.svg?color=pink&shade=500', status: 'Proposal', value: 35000, source: 'Webinar', assignedTo: '3', assignedToName: 'Chloé Martin', activity: [], aiInsights: { summary: '', talkingPoints:[], risks:[] } },
];

export const getLeads = (): LeadDetail[] => {
    try {
        const data = localStorage.getItem(LEADS_DB_KEY);
        if (data) {
            return JSON.parse(data);
        } else {
            localStorage.setItem(LEADS_DB_KEY, JSON.stringify(initialLeadsData));
            return initialLeadsData;
        }
    } catch (error) {
        console.error("Failed to load leads from localStorage", error);
        return initialLeadsData;
    }
};

export const getLeadById = (id: string): LeadDetail | undefined => {
    const leads = getLeads();
    return leads.find(l => l.id === id);
};

export const updateLead = (updatedLead: LeadDetail): void => {
    try {
        const leads = getLeads();
        const index = leads.findIndex(l => l.id === updatedLead.id);
        if (index !== -1) {
            leads[index] = updatedLead;
            localStorage.setItem(LEADS_DB_KEY, JSON.stringify(leads));
            window.dispatchEvent(new Event('storage'));
        }
    } catch (error) {
        console.error("Failed to save lead to localStorage", error);
    }
};

export const addLead = (leadData: Partial<LeadDetail>): LeadDetail => {
    const leads = getLeads();
    const newLead: LeadDetail = {
        id: `lead-${Date.now()}`,
        name: leadData.name || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        designation: leadData.designation || '',
        linkedin: leadData.linkedin || '',
        linkedinUrl: leadData.linkedinUrl || '',
        location: leadData.location || '',
        company: leadData.company || '',
        website: leadData.website || '',
        companyLogo: leadData.companyLogo || `https://ui-avatars.com/api/?name=${(leadData.company || 'N A').charAt(0)}&color=7F9CF5&background=EBF4FF`,
        status: leadData.status || 'New',
        value: leadData.value || 0,
        source: leadData.source || 'Manual',
        assignedTo: leadData.assignedTo || '1',
        assignedToName: leadData.assignedToName || 'Unassigned',
        notes: leadData.notes || '',
        activity: [],
        aiInsights: {
            summary: "Newly created lead. AI analysis pending.",
            talkingPoints: [],
            risks: []
        },
    };
    const updatedLeads = [newLead, ...leads];
    localStorage.setItem(LEADS_DB_KEY, JSON.stringify(updatedLeads));
    window.dispatchEvent(new Event('storage')); // Notify other tabs/components
    return newLead;
}

export const checkDuplicateEmail = (email: string): LeadDetail | null => {
    if (!email) return null;
    const leads = getLeads();
    const found = leads.find(lead => lead.email.toLowerCase() === email.toLowerCase());
    return found || null;
}

const normalizeUrl = (url: string): string => {
    if (!url) return '';
    return url.replace(/^(https?:\/\/)?(www\.)?/i, '').replace(/\/$/, '');
}

export const checkDuplicateWebsite = (website: string): LeadDetail | null => {
    if (!website) return null;
    const leads = getLeads();
    const normalizedTargetUrl = normalizeUrl(website);
    if (!normalizedTargetUrl) return null;

    const found = leads.find(lead => {
        if (lead.website) {
            return normalizeUrl(lead.website) === normalizedTargetUrl;
        }
        return false;
    });
    return (found as LeadDetail | undefined) || null;
};