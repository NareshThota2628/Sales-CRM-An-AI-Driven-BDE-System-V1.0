import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { teamMembersData } from '../data/team';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { title: string; priority: string; assignees: string[] }) => void;
  defaultAssigneeId?: string;
}

const priorities = ['High Priority', 'Important', 'OK', 'Meh', 'Not that important'];

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, defaultAssigneeId }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Important');
    const [assignees, setAssignees] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setPriority('Important');
            setAssignees(defaultAssigneeId ? new Set([defaultAssigneeId]) : new Set());
        }
    }, [isOpen, defaultAssigneeId]);

    const handleAssigneeToggle = (id: string) => {
        const newAssignees = new Set(assignees);
        if (newAssignees.has(id)) {
            newAssignees.delete(id);
        } else {
            newAssignees.add(id);
        }
        setAssignees(newAssignees);
    };

    const handleSave = () => {
        if (!title) return;
        onSave({ title, priority, assignees: Array.from(assignees) });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Task</h2>
                <p className="text-slate-500 mb-6">Assign a new task to yourself or a team member.</p>
                <div className="space-y-5">
                    <Input label="Task Title" id="task-title" type="text" placeholder="e.g., Follow up with Innovatech" value={title} onChange={e => setTitle(e.target.value)} required />
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-500 mb-2">Priority</label>
                        <select id="priority" value={priority} onChange={e => setPriority(e.target.value)} className="w-full py-4 px-6 bg-gray-100/60 rounded-full text-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white">
                            {priorities.map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Assignees</label>
                        <div className="flex flex-wrap gap-2">
                            {teamMembersData.map(member => (
                                <button key={member.id} onClick={() => handleAssigneeToggle(member.id)} className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${assignees.has(member.id) ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                    <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-medium">{member.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="pt-8 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="button" onClick={handleSave}>Create Task</Button>
                </div>
            </div>
        </Modal>
    );
};

export default TaskModal;
