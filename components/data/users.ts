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

export const usersData: User[] = [
  { id: 'usr-1', name: 'Amélie Laurent', email: 'amelie@example.com', phone: '555-0101', avatar: 'https://i.pravatar.cc/150?img=1', role: 'BDE', status: 'Active', leads: 125, conversionRate: 22, closedARR: 120500, performanceHistory: [{month: 'Jan', arr: 25000}, {month: 'Feb', arr: 28000}, {month: 'Mar', arr: 35000}, {month: 'Apr', arr: 32000}, {month: 'May', arr: 41000}] },
  { id: 'usr-2', name: 'Benoît Dubois', email: 'benoit@example.com', phone: '555-0102', avatar: 'https://i.pravatar.cc/150?img=2', role: 'BDE', status: 'Active', leads: 98, conversionRate: 18, closedARR: 85000, performanceHistory: [{month: 'Jan', arr: 15000}, {month: 'Feb', arr: 18000}, {month: 'Mar', arr: 15000}, {month: 'Apr', arr: 22000}, {month: 'May', arr: 28000}] },
  { id: 'usr-3', name: 'Chloé Martin', email: 'chloe@example.com', phone: '555-0103', avatar: 'https://i.pravatar.cc/150?img=3', role: 'BDE', status: 'Active', leads: 150, conversionRate: 25, closedARR: 152000, performanceHistory: [{month: 'Jan', arr: 30000}, {month: 'Feb', arr: 28000}, {month: 'Mar', arr: 45000}, {month: 'Apr', arr: 48000}, {month: 'May', arr: 51000}] },
  { id: 'usr-4', name: 'David Garcia', email: 'david@example.com', phone: '555-0104', avatar: 'https://i.pravatar.cc/150?img=4', role: 'BDE', status: 'Inactive', leads: 45, conversionRate: 15, closedARR: 35000, performanceHistory: [{month: 'Jan', arr: 5000}, {month: 'Feb', arr: 8000}, {month: 'Mar', arr: 15000}, {month: 'Apr', arr: 12000}, {month: 'May', arr: 11000}] },
  { id: 'usr-5', name: 'Elise Moreau', email: 'elise@example.com', phone: '555-0105', avatar: 'https://i.pravatar.cc/150?img=5', role: 'BDE', status: 'Active', leads: 82, conversionRate: 12, closedARR: 62000, performanceHistory: [{month: 'Jan', arr: 12000}, {month: 'Feb', arr: 10000}, {month: 'Mar', arr: 15000}, {month: 'Apr', arr: 18000}, {month: 'May', arr: 20000}] },
  { id: 'usr-6', name: 'François Lambert', email: 'francois@example.com', phone: '555-0106', avatar: 'https://i.pravatar.cc/150?img=6', role: 'Admin', status: 'Active', leads: 0, conversionRate: 0, closedARR: 0, performanceHistory: [] },
];

export const assigneeAvatars: { [key: string]: string } = usersData.reduce((acc, user) => {
    acc[user.id] = user.avatar;
    return acc;
}, {} as { [key: string]: string });