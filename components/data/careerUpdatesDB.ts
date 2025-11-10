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

export const careerUpdatesDB: CareerUpdate[] = [
    {
        id: 'cu-1',
        leadId: 'lead-1',
        leadName: 'John Doe',
        leadAvatar: 'https://i.pravatar.cc/150?u=johndoe',
        bdeOwnerId: getLeadById('lead-1')?.assignedTo || '1',
        type: 'job_change',
        timestamp: '2h ago',
        title: 'Job Change Detected',
        description: 'John Doe has started a new position as Director of Engineering at Apex Innovations.',
        details: {
            oldCompany: 'Innovatech',
            newCompany: 'Apex Innovations',
            oldPosition: 'VP of Engineering',
            newPosition: 'Director of Engineering',
        }
    },
    {
        id: 'cu-2',
        leadId: 'lead-3',
        leadName: 'Sam Wilson',
        leadAvatar: 'https://i.pravatar.cc/150?u=samwilson',
        bdeOwnerId: getLeadById('lead-3')?.assignedTo || '1',
        type: 'hiring_signal',
        timestamp: '1d ago',
        title: 'Hiring Signal at DataCorp',
        description: 'DataCorp is actively hiring for 5 new Data Scientists, indicating potential team growth.',
        details: {
            link: '#'
        }
    },
    {
        id: 'cu-3',
        leadId: 'lead-6',
        leadName: 'Linda Davis',
        leadAvatar: 'https://i.pravatar.cc/150?u=lindadavis',
        bdeOwnerId: getLeadById('lead-6')?.assignedTo || '1',
        type: 'company_news',
        timestamp: '3d ago',
        title: 'Funding News at Quantum Leap',
        description: 'Quantum Leap just secured a $50M Series B funding round to expand their research.',
        details: {
            link: '#'
        }
    },
    {
        id: 'cu-4',
        leadId: 'lead-4',
        leadName: 'Patricia Williams',
        leadAvatar: 'https://i.pravatar.cc/150?u=patriciawilliams',
        bdeOwnerId: getLeadById('lead-4')?.assignedTo || '3',
        type: 'job_change',
        timestamp: '4d ago',
        title: 'Job Change Detected',
        description: 'Patricia Williams has moved from FutureGadget to become CEO at Visionary Tech.',
        details: {
            oldCompany: 'FutureGadget',
            newCompany: 'Visionary Tech',
            oldPosition: 'CEO',
            newPosition: 'CEO',
        }
    },
];
