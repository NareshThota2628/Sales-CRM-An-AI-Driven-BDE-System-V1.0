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

export const teamMembersData: TeamMember[] = [];