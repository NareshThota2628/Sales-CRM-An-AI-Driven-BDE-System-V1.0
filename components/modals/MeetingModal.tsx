import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SparklesIcon from '../icons/SparklesIcon';
import { Meeting } from '../data/meetingsDB';
import LinkIcon from '../icons/LinkIcon';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Omit<Meeting, 'id'>) => void;
  meeting: Meeting | null;
  initialDate: Date | null;
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onClose, onSave, meeting, initialDate }) => {
    const [title, setTitle] = useState('');
    const [attendees, setAttendees] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [notes, setNotes] = useState('');
    const [link, setLink] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const targetMeeting = meeting || { start: initialDate || new Date() };
            const startDate = new Date(targetMeeting.start);
            
            setTitle(meeting?.title || '');
            setAttendees(meeting?.attendees.join(', ') || '');
            setDate(startDate.toISOString().split('T')[0]);
            
            const defaultStartTime = meeting ? startDate : initialDate || new Date();
            const defaultEndTime = meeting?.end ? new Date(meeting.end) : new Date(defaultStartTime.getTime() + 60 * 60 * 1000);

            setStartTime(defaultStartTime.toTimeString().substring(0, 5));
            setEndTime(defaultEndTime.toTimeString().substring(0, 5));
            setNotes(meeting?.notes || '');
            setLink(meeting?.link || '');

        }
    }, [isOpen, meeting, initialDate]);

    const handleSave = () => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        const start = new Date(date);
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, endMinute, 0, 0);

        onSave({ title, attendees: attendees.split(',').map(a => a.trim()), start, end, notes, link });
    };

    const handleGenerateAgenda = async () => {
        if (!title) return;
        setIsGenerating(true);
        setNotes('Generating...');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a concise meeting agenda for the topic: "${title}". Include key talking points and time allocations.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setNotes(response.text);
        } catch (error) {
            console.error("Agenda generation failed:", error);
            setNotes("Failed to generate agenda. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{meeting ? 'Edit Meeting' : 'Schedule a New Meeting'}</h2>
                <p className="text-slate-500 mb-6">Fill in the details and let AI help you prepare.</p>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <Input label="Meeting Title / Topic" id="meeting-title" type="text" placeholder="e.g., Q3 Strategy Kick-off" value={title} onChange={e => setTitle(e.target.value)} />
                    <Input label="Attendees (comma-separated)" id="attendees" type="text" placeholder="e.g., John Doe, Jane Smith" value={attendees} onChange={e => setAttendees(e.target.value)} />
                    <Input label="Meeting Link" id="meeting-link" type="url" placeholder="e.g., https://meet.google.com/..." value={link} onChange={e => setLink(e.target.value)} icon={<LinkIcon className="w-5 h-5 text-gray-400" />} />
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Date" id="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        <Input label="Start Time" id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                        <Input label="End Time" id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-500 mb-2">Notes/Agenda</label>
                        <div className="relative">
                            <textarea id="notes" rows={8} value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe the meeting goals or generate an agenda with AI..."/>
                            <Button type="button" onClick={handleGenerateAgenda} isLoading={isGenerating} className="!absolute bottom-3 right-3 !py-2 !px-3" leftIcon={<SparklesIcon className="w-4 h-4"/>}>
                                Generate with AI
                            </Button>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="button" onClick={handleSave}>{meeting ? 'Save Changes' : 'Schedule'}</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default MeetingModal;