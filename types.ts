
export enum UserRole {
  BDE = 'BDE',
  MASTERCLASS = 'Masterclass',
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Unqualified' | 'Closed';

export type NotificationType = 'new_lead' | 'chat_mention' | 'conversion_approved' | 'ai_insight' | 'career_update' | 'task_assigned' | 'task_progress' | 'task_completed';