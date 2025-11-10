export enum UserRole {
  BDE = 'BDE',
  MASTERCLASS = 'Masterclass',
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Unqualified' | 'Closed';

// New types for Task Management and Notifications
export type TaskStatus = 'todo' | 'inprogress' | 'completed';
export type TaskPriority = 'Important' | 'Meh' | 'OK' | 'High Priority' | 'Not that important';

export interface Comment {
  id: string;
  authorId: string; // 'master-admin' or user id like '1'
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignees: string[]; // array of user IDs
  comments: Comment[];
}

export type NotificationType = 'new_lead' | 'chat_mention' | 'conversion_approved' | 'ai_insight' | 'career_update' | 'task_assigned' | 'task_progress' | 'task_completed';

export interface Notification {
    id: string;
    userId: string; // The user who should receive it
    type: NotificationType;
    title: string;
    description: string;
    link: string;
    read: boolean;
    timestamp: string;
}
