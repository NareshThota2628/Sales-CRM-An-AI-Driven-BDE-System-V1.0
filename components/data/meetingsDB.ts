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

const initialMeetings: Meeting[] = [];

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