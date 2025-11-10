import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import UserIcon from '../icons/UserIcon';
import MailIcon from '../icons/MailIcon';
import PhoneIcon from '../icons/PhoneIcon';
import LockIcon from '../icons/LockIcon';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('BDE');

    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
            setName('');
            setEmail('');
            setPhone('');
            setPassword('');
            setRole('BDE');
        }
    }, [isOpen]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) return;
        onSave({ name, email, phone, password, role });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New User</h2>
                <p className="text-slate-500 mb-6">Enter the credentials for the new user.</p>
                <form className="space-y-5" onSubmit={handleSave}>
                    <Input label="Full Name" id="create-name" type="text" placeholder="John Doe" icon={<UserIcon className="w-5 h-5 text-gray-400" />} value={name} onChange={e => setName(e.target.value)} required />
                    <Input label="Email Address" id="create-email" type="email" placeholder="john.doe@company.com" icon={<MailIcon className="w-5 h-5 text-gray-400" />} value={email} onChange={e => setEmail(e.target.value)} required />
                    <Input label="Phone Number" id="create-phone" type="tel" placeholder="555-123-4567" icon={<PhoneIcon className="w-5 h-5 text-gray-400" />} value={phone} onChange={e => setPhone(e.target.value)} />
                    <Input label="Password" id="create-password" type="password" placeholder="Set a temporary password" icon={<LockIcon className="w-5 h-5 text-gray-400" />} value={password} onChange={e => setPassword(e.target.value)} required />
                    <div>
                         <label htmlFor="role" className="block text-sm font-medium text-gray-500 mb-2">Role</label>
                         <select id="role" value={role} onChange={e => setRole(e.target.value)} className="w-full py-4 px-6 bg-gray-100/60 rounded-full text-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all duration-300">
                            <option>BDE</option>
                            <option>Admin</option>
                         </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Create User</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default CreateUserModal;