import { getLeadById } from './leadsDB';

export interface CareerUpdate {
  id: string;
  leadId: string;
  leadName: string;
  leadAvatar: string;
  bdeOwnerId: string;
  type: 'job_change' | 'hiring_signal' | 'promotion' | 'company_news';
  timestamp: string;
  title: string;
  description: string;
  details?: {
    oldCompany?: string;
    newCompany?: string;
    oldPosition?: string;
    newPosition?: string;
    link?: string;
  };
}

export const careerUpdatesDB: CareerUpdate[] = [];
