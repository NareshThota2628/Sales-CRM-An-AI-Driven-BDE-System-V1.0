export interface Meeting {
    id: string;
    title: string;
    start: Date;
    end: Date;
    attendees: string[];
    link?: string;
    notes?: string;
    notified?: boolean;
}

const MEETINGS_DB_KEY = 'crm_meetings_data';

const initialMeetings: Meeting[] = [
    { id: '1', title: 'Q3 Strategy with Innovatech', start: new Date('2024-07-15T10:00:00'), end: new Date('2024-07-15T11:30:00'), attendees: ['John Doe'], notes: 'Discuss Q3 goals and renewal terms.', link: 'https://meet.google.com/xyz-abc-def' },
    { id: '2', title: 'Demo for Solutions Inc.', start: new Date('2024-07-15T14:00:00'), end: new Date('2024-07-15T15:00:00'), attendees: ['Jane Smith'], notes: 'Focus on AI features and integrations.' },
    { id: '3', title: 'Team Sync', start: new Date(), end: new Date(new Date().getTime() + 30 * 60000), attendees: ['Sales Team'], notes: 'This meeting will trigger a notification.', link: 'https://meet.google.com/ghi-jkl-mno' },
    { id: '4', title: 'Follow-up with DataCorp', start: new Date('2024-07-25T11:00:00'), end: new Date('2024-07-25T11:30:00'), attendees: ['Sam Wilson'], notes: 'Follow up on proposal and answer any final questions.' },
];
// To make the notification demo work, let's set a meeting to start in 2 minutes
initialMeetings[2].start.setMinutes(initialMeetings[2].start.getMinutes() + 2);

const getMeetings = (): Meeting[] => {
    try {
        const data = localStorage.getItem(MEETINGS_DB_KEY);
        if (data) {
            // Dates are stored as strings in JSON, need to convert back
            return JSON.parse(data).map((m: any) => ({
                ...m,
                start: new Date(m.start),
                end: new Date(m.end),
            }));
        } else {
            localStorage.setItem(MEETINGS_DB_KEY, JSON.stringify(initialMeetings));
            return initialMeetings;
        }
    } catch (error) {
        console.error("Failed to load meetings from localStorage", error);
        return initialMeetings;
    }
};

const saveMeetings = (meetings: Meeting[]): void => {
    try {
        localStorage.setItem(MEETINGS_DB_KEY, JSON.stringify(meetings));
        window.dispatchEvent(new Event('storage')); // Notify other tabs/components
    } catch (error) {
        console.error("Failed to save meetings to localStorage", error);
    }
};

const addMeeting = (meetingData: Omit<Meeting, 'id'>): Meeting => {
    const meetings = getMeetings();
    const newMeeting: Meeting = {
        ...meetingData,
        id: `meeting-${Date.now()}`,
    };
    const updatedMeetings = [...meetings, newMeeting];
    saveMeetings(updatedMeetings);
    return newMeeting;
};

const updateMeeting = (updatedMeeting: Meeting): void => {
    const meetings = getMeetings();
    const index = meetings.findIndex(m => m.id === updatedMeeting.id);
    if (index !== -1) {
        meetings[index] = updatedMeeting;
        saveMeetings(meetings);
    }
};

const deleteMeeting = (id: string): void => {
    const meetings = getMeetings();
    const updatedMeetings = meetings.filter(m => m.id !== id);
    saveMeetings(updatedMeetings);
};

export const meetingsDB = {
    getAll: getMeetings,
    add: addMeeting,
    update: updateMeeting,
    delete: deleteMeeting,
};
