import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Meeting } from '../data/meetingsDB';
import CalendarIcon from '../icons/CalendarIcon';
import ClockIcon from '../icons/ClockIcon';
import UsersIcon from '../icons/UsersIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import LinkIcon from '../icons/LinkIcon';
import FileTextIcon from '../icons/FileTextIcon';

interface MeetingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onDelete: () => void;
  onEdit: () => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-500 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <div className="text-slate-800">{children}</div>
        </div>
    </div>
);

const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({ isOpen, onClose, meeting, onDelete, onEdit }) => {
    if (!meeting) return null;

    const formatDate = (date: Date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formatTime = (date: Date) => new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">{meeting.title}</h2>
                    {meeting.link && <Button onClick={() => window.open(meeting.link, '_blank')}>Join Meeting</Button>}
                </div>
                <div className="space-y-4">
                    <DetailItem icon={<CalendarIcon className="w-5 h-5" />} label="Date">
                        <p>{formatDate(meeting.start)}</p>
                    </DetailItem>
                    <DetailItem icon={<ClockIcon className="w-5 h-5" />} label="Time">
                        <p>{formatTime(meeting.start)} - {formatTime(meeting.end)}</p>
                    </DetailItem>
                    <DetailItem icon={<UsersIcon className="w-5 h-5" />} label="Attendees">
                        <div className="flex flex-wrap gap-2">
                            {meeting.attendees.map(att => <span key={att} className="bg-slate-100 text-slate-700 text-sm font-medium px-2 py-1 rounded-md">{att}</span>)}
                        </div>
                    </DetailItem>
                    {meeting.link && (
                        <DetailItem icon={<LinkIcon className="w-5 h-5" />} label="Meeting Link">
                            <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all">{meeting.link}</a>
                        </DetailItem>
                    )}
                    <DetailItem icon={<FileTextIcon className="w-5 h-5" />} label="Notes/Agenda">
                        <div className="whitespace-pre-wrap text-sm bg-slate-50 p-3 rounded-md max-h-40 overflow-y-auto">{meeting.notes || 'No notes for this meeting.'}</div>
                    </DetailItem>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onDelete} className="!text-red-600 hover:!bg-red-50 !border-red-200" leftIcon={<TrashIcon className="w-4 h-4"/>}>Delete</Button>
                    <Button onClick={onEdit} leftIcon={<EditIcon className="w-4 h-4"/>}>Edit</Button>
                </div>
            </div>
        </Modal>
    );
};

export default MeetingDetailModal;
