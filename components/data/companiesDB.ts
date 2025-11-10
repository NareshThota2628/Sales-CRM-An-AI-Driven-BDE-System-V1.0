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

const initialCompaniesData: CompanyDetail[] = [];


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