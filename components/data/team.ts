export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    online: boolean;
    stats?: {
        leads: number;
        conversionRate: number;
        closedARR: number;
    }
}

export const teamMembersData: TeamMember[] = [
    { id: 'usr-1', name: 'Amélie Laurent', role: 'Business Development Executive', avatar: 'https://i.pravatar.cc/150?img=1', online: true, stats: { leads: 125, conversionRate: 22, closedARR: 120500 } },
    { id: 'usr-2', name: 'Benoît Dubois', role: 'Sales Manager', avatar: 'https://i.pravatar.cc/150?img=2', online: false, stats: { leads: 98, conversionRate: 18, closedARR: 85000 } },
    { id: 'usr-3', name: 'Chloé Martin', role: 'Lead Qualifier', avatar: 'https://i.pravatar.cc/150?img=3', online: true, stats: { leads: 150, conversionRate: 25, closedARR: 152000 } },
    { id: 'usr-4', name: 'David Garcia', role: 'Business Development Executive', avatar: 'https://i.pravatar.cc/150?img=4', online: true, stats: { leads: 45, conversionRate: 15, closedARR: 35000 } },
    { id: 'usr-5', name: 'Elise Moreau', role: 'Account Executive', avatar: 'https://i.pravatar.cc/150?img=5', online: false, stats: { leads: 82, conversionRate: 12, closedARR: 62000 } },
    { id: 'usr-6', name: 'François Lambert', role: 'Business Development Executive', avatar: 'https://i.pravatar.cc/150?img=6', online: true, stats: { leads: 70, conversionRate: 19, closedARR: 95000 } },
    { id: 'usr-7', name: 'Gabrielle Roy', role: 'Sales Development Rep', avatar: 'https://i.pravatar.cc/150?img=7', online: false, stats: { leads: 110, conversionRate: 21, closedARR: 110000 } },
    { id: 'usr-8', name: 'Hugo Bernard', role: 'Team Lead', avatar: 'https://i.pravatar.cc/150?img=8', online: true, stats: { leads: 130, conversionRate: 24, closedARR: 135000 } },
];