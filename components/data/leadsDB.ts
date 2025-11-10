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

const initialLeadsData: LeadDetail[] = [];

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