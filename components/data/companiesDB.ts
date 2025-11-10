import { Activity } from './leadsDB'; // Re-use from leadsDB

export type AccountHealth = 'Healthy' | 'Needs Attention' | 'At Risk';

export interface CompanyContact {
    name: string;
    title: string;
    avatar: string;
}

export interface CompanyDeal {
    name: string;
    stage: string;
    amount: number;
}

export interface CompanyDetail {
  id: string;
  name: string;
  logo: string;
  description: string;
  health: AccountHealth;
  healthScore: number;
  arr: number;
  conversionDate: string;
  lastActivity: string;
  nextAction?: string;
  openDeals: number;
  activity: Activity[];
  contacts: CompanyContact[];
  deals: CompanyDeal[];
  aiInsights: {
      positive: string[];
      negative: string[];
  };
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
}

const COMPANIES_DB_KEY = 'crm_companies_data';

const initialCompaniesData: CompanyDetail[] = [
  { 
    id: 'comp-1', 
    name: 'Innovatech', 
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600', 
    description: 'Leading provider of enterprise SaaS solutions, specializing in cloud-based analytics and business intelligence.', 
    health: 'Healthy', 
    healthScore: 92,
    arr: 50000, 
    conversionDate: 'Aug 15, 2023',
    lastActivity: '2 days ago',
    nextAction: 'QBR on Jul 28',
    openDeals: 1,
    owner: { id: 'usr-1', name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1' },
    activity: [
        { id: 'c-act-1', type: 'note', content: 'Customer is very happy with the platform. Potential for upsell next quarter.', author: 'Amélie Laurent', time: '3 days ago' },
        { id: 'c-act-2', type: 'call', content: 'Q4 check-in call. Discussed roadmap and upcoming features.', author: 'Amélie Laurent', time: '1 week ago' },
        { id: 'c-act-3', type: 'email', content: 'Sent over contract renewal documents for review.', author: 'System', time: '2 weeks ago' },
        { id: 'c-act-4', type: 'status_change', content: 'Account health updated to "Healthy" based on high product usage.', author: 'System', time: '1 month ago' },
    ],
    contacts: [
        { name: 'John Doe', title: 'VP of Engineering', avatar: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Sarah Jenkins', title: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=12' },
    ],
    deals: [
        { name: 'Initial Enterprise License', stage: 'Closed Won', amount: 50000 },
        { name: 'Analytics Pro Add-on', stage: 'In Progress', amount: 15000 },
    ],
    aiInsights: {
        positive: [
            "Usage of the analytics module has tripled in the last 30 days. Propose an upgrade to the Premium Analytics Suite.",
            "Company just posted a new job for 'Head of Marketing'. This is a great opportunity to introduce our marketing automation tools."
        ],
        negative: [
            "No admin-level logins detected in the past 14 days. Suggest a proactive check-in to ensure they are getting value."
        ]
    }
  },
  { 
    id: 'comp-2', 
    name: 'Quantum Leap', 
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500', 
    description: 'Pioneering quantum computing technologies.', 
    health: 'Healthy', 
    healthScore: 88, 
    arr: 120000, 
    conversionDate: 'Jun 20, 2023',
    lastActivity: '5 days ago',
    nextAction: 'Renewal discussion',
    openDeals: 0,
    owner: { id: 'usr-1', name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1' },
    activity: [],
    contacts: [],
    deals: [],
    aiInsights: { positive: [], negative: [] }
  },
  { 
    id: 'comp-3', 
    name: 'DataCorp', 
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=green&shade=500', 
    description: 'Big data and analytics platform.', 
    health: 'Needs Attention', 
    healthScore: 65, 
    arr: 20000, 
    conversionDate: 'Oct 05, 2023',
    lastActivity: '14 days ago',
    nextAction: 'Follow-up call',
    openDeals: 1,
    owner: { id: 'usr-3', name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3' },
    activity: [],
    contacts: [],
    deals: [],
    aiInsights: { positive: [], negative: [] }
  },
  { 
    id: 'comp-4', 
    name: 'Synergy LLC', 
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500', 
    description: 'Cloud consulting and integration services.', 
    health: 'At Risk', 
    healthScore: 45, 
    arr: 10000, 
    conversionDate: 'Feb 10, 2023',
    lastActivity: '1 month ago',
    nextAction: undefined,
    openDeals: 0,
    owner: { id: 'usr-2', name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2' },
    activity: [],
    contacts: [],
    deals: [],
    aiInsights: { positive: [], negative: [] }
  },
  { 
    id: 'comp-5', 
    name: 'NextGen AI', 
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=pink&shade=500', 
    description: 'AI-driven automation tools.', 
    health: 'Healthy', 
    healthScore: 95, 
    arr: 35000, 
    conversionDate: 'Jan 15, 2024', 
    lastActivity: '1 day ago', 
    nextAction: 'Renewal discussion', 
    openDeals: 2, 
    owner: { id: 'usr-4', name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4' },
    activity: [], 
    contacts: [], 
    deals: [], 
    aiInsights: { positive: [], negative: [] } 
  },
  { 
    id: 'comp-6', 
    name: 'Solutions Inc.', 
    logo: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500', 
    description: 'Custom software development agency.', 
    health: 'Needs Attention', 
    healthScore: 72, 
    arr: 75000, 
    conversionDate: 'Mar 22, 2023', 
    lastActivity: '7 days ago', 
    openDeals: 1, 
    owner: { id: 'usr-4', name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4' },
    activity: [], 
    contacts: [], 
    deals: [], 
    aiInsights: { positive: [], negative: [] } 
  },
];


export const getCompanies = (): CompanyDetail[] => {
    try {
        const data = localStorage.getItem(COMPANIES_DB_KEY);
        if (data) {
            return JSON.parse(data);
        } else {
            localStorage.setItem(COMPANIES_DB_KEY, JSON.stringify(initialCompaniesData));
            return initialCompaniesData;
        }
    } catch (error) {
        console.error("Failed to load companies from localStorage", error);
        return initialCompaniesData;
    }
};

export const getCompanyById = (id: string): CompanyDetail | undefined => {
    const companies = getCompanies();
    return companies.find(c => c.id === id);
};

export const updateCompany = (updatedCompany: CompanyDetail): void => {
    try {
        const companies = getCompanies();
        const index = companies.findIndex(c => c.id === updatedCompany.id);
        if (index !== -1) {
            companies[index] = updatedCompany;
            localStorage.setItem(COMPANIES_DB_KEY, JSON.stringify(companies));
            window.dispatchEvent(new Event('storage'));
        }
    } catch (error) {
        console.error("Failed to save company to localStorage", error);
    }
};