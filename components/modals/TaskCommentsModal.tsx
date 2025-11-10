import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SendIcon from '../icons/SendIcon';
import UserIcon from '../icons/UserIcon';

interface Comment {
  user?: string; // Kept for compatibility
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  time: string;
}

interface Task {
  id: string;
  title: string;
  comments?: Comment[];
}

interface CurrentUser {
    id: string;
    role: 'BDE' | 'Master';
}

interface TaskCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onAddComment: (taskId: string, commentText: string) => void;
  currentUser: CurrentUser;
}

const TaskCommentsModal: React.FC<TaskCommentsModalProps> = ({ isOpen, onClose, task, onAddComment, currentUser }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task && newComment.trim()) {
            onAddComment(task.id, newComment);
            setNewComment('');
        }
    };

    if (!task) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 truncate">Task Chat: {task.title}</h2>
                <div className="mt-6 space-y-4 max-h-80 overflow-y-auto pr-2">
                    {task.comments?.length ? task.comments.map((comment, index) => {
                        const isMaster = comment.authorId === 'master-admin';
                        const showSubtle = isMaster && currentUser.role === 'BDE';
                        return (
                            <div key={index} className={`flex items-start gap-3 ${showSubtle ? 'opacity-80' : ''}`}>
                                {showSubtle ? (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center" title="Master Admin">
                                        <UserIcon className="w-4 h-4 text-slate-500" />
                                    </div>
                                ) : (
                                    <img src={comment.authorAvatar} alt={comment.authorName} className="w-8 h-8 rounded-full" />
                                )}
                                <div className={`flex-1 p-3 rounded-lg ${showSubtle ? 'bg-slate-100' : 'bg-indigo-50'}`}>
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm text-slate-800">{comment.authorName}</p>
                                        <p className="text-xs text-slate-500">{comment.time}</p>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-1">{comment.text}</p>
                                </div>
                            </div>
                        )
                    }) : <p className="text-center text-slate-500 py-8">No comments yet. Start the conversation!</p>}
                </div>
                <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 py-3 px-4 bg-slate-100 rounded-full text-slate-800 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Button type="submit" className="!p-3.5" aria-label="Send comment">
                        <SendIcon className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </Modal>
    );
};

export default TaskCommentsModal;