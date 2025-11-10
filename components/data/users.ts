export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'BDE' | 'Admin';
  status: UserStatus;
  leads: number;
  conversionRate: number;
  closedARR: number;
  performanceHistory: { month: string; arr: number }[];
}

export const usersData: User[] = [];

export const assigneeAvatars: { [key: string]: string } = {};
