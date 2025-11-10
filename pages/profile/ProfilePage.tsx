import React, { useState, useRef, useMemo } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CameraIcon from '../../components/icons/CameraIcon';
import ProgressBar from '../../components/ui/ProgressBar';
import UserIcon from '../../components/icons/UserIcon';
import SignatureIcon from '../../components/icons/SignatureIcon';
import ShieldIcon from '../../components/icons/ShieldIcon';
import BellIcon from '../../components/icons/BellIcon';
import LinkedinIcon from '../../components/icons/LinkedinIcon';
import MapPinIcon from '../../components/icons/MapPinIcon';
import ClockIcon from '../../components/icons/ClockIcon';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import AtSignIcon from '../../components/icons/AtSignIcon';

type Tab = 'profile' | 'signature' | 'security' | 'notifications';

const ProfilePage: React.FC = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    
    // State for new features
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('https://i.pravatar.cc/150');
    const [phone, setPhone] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [signature, setSignature] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const profileCompletion = useMemo(() => {
        let score = 0;
        if (avatar !== 'https://i.pravatar.cc/150') score += 25;
        if (phone) score += 25;
        if (linkedin) score += 25;
        if (signature) score += 25;
        return score;
    }, [avatar, phone, linkedin, signature]);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setAvatar(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        setTimeout(() => setIsUpdatingPassword(false), 1500);
    };

    const TabButton: React.FC<{ tabId: Tab, icon: React.ReactNode, label: string }> = ({ tabId, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === tabId ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
        >
            {icon}
            {label}
        </button>
    );

    const SettingsRow: React.FC<{ label: string; description: string; control: React.ReactNode }> = ({ label, description, control }) => (
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <div>
                <h4 className="font-semibold text-slate-700">{label}</h4>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            <div>{control}</div>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal information, signature, and security settings.</p>
            </header>

            {/* Profile Summary Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <img src={avatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover" />
                            <button onClick={handleAvatarClick} className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 hover:bg-yellow-500 transition-all transform hover:scale-110 shadow-md">
                                <CameraIcon className="w-4 h-4" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{name || 'Your Name'}</h2>
                            <p className="text-slate-500">Business Development Executive</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-semibold text-slate-700">Profile Completion</h3>
                            <p className="font-bold text-indigo-600">{profileCompletion}%</p>
                        </div>
                        <ProgressBar value={profileCompletion} />
                        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                            <div><p className="text-sm text-slate-500">Closed ARR (QTD)</p><p className="font-bold text-lg text-slate-800">$0</p></div>
                            <div><p className="text-sm text-slate-500">Conversion Rate</p><p className="font-bold text-lg text-slate-800">0%</p></div>
                            <div><p className="text-sm text-slate-500">Active Leads</p><p className="font-bold text-lg text-slate-800">0</p></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-max animate-fade-in" style={{ animationDelay: '200ms' }}>
                <TabButton tabId="profile" icon={<UserIcon className="w-4 h-4" />} label="Profile" />
                <TabButton tabId="signature" icon={<SignatureIcon className="w-4 h-4" />} label="Email Signature" />
                <TabButton tabId="security" icon={<ShieldIcon className="w-4 h-4" />} label="Security" />
                <TabButton tabId="notifications" icon={<BellIcon className="w-4 h-4" />} label="Notifications" />
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                {activeTab === 'profile' && (
                    <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-md p-8 space-y-5">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Personal Information</h3>
                            <Input label="Full Name" id="full-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Amélie Laurent" />
                            <Input label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="amelielaurent7622@gmail.com" />
                            <Input label="Phone Number" id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                            <Input label="LinkedIn Profile URL" id="linkedin" type="text" value={linkedin} onChange={e => setLinkedin(e.target.value)} icon={<LinkedinIcon className="w-5 h-5 text-gray-400" />} />
                             <div className="pt-2 text-right">
                                <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                            </div>
                        </div>
                         <div className="bg-white rounded-2xl shadow-md p-8 space-y-5">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Work & Availability</h3>
                            <Input label="Job Title" id="job-title" type="text" defaultValue="Business Development Executive" />
                            <Input label="Sales Territory" id="territory" type="text" placeholder="e.g., West Coast, USA" icon={<MapPinIcon className="w-5 h-5 text-gray-400" />} />
                             <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Timezone</label>
                                <select className="w-full py-4 px-6 bg-gray-100/60 rounded-full text-gray-800 border border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white">
                                    <option>(GMT-08:00) Pacific Time</option>
                                    <option>(GMT-05:00) Eastern Time</option>
                                </select>
                             </div>
                        </div>
                    </form>
                )}
                {activeTab === 'signature' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-md p-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Signature Editor</h3>
                            <p className="text-sm text-slate-500 mb-4">Use placeholders like <code>{'{{name}}'}</code> or <code>{'{{title}}'}</code>.</p>
                            <textarea value={signature} onChange={e => setSignature(e.target.value)} rows={8} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
                            <div className="pt-4 text-right">
                                <Button isLoading={isSaving} onClick={(e) => { e.preventDefault(); setIsSaving(true); setTimeout(() => setIsSaving(false), 1500)}}>Save Signature</Button>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-md p-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Live Preview</h3>
                            <div className="p-4 border border-dashed border-slate-300 rounded-lg min-h-[200px]">
                                <p className="whitespace-pre-wrap text-sm text-slate-700">
                                    {signature
                                        .replace('{{name}}', name || 'Your Name')
                                        .replace('{{title}}', 'Business Development Executive')
                                        .replace('{{phone}}', phone)
                                        .replace('{{email}}', email || 'your.email@company.com')
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'security' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-md p-8">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Change Password</h3>
                            <form className="space-y-5" onSubmit={handleUpdatePassword}>
                                <Input label="Current Password" id="current-password" type="password" placeholder="••••••••••••" />
                                <Input label="New Password" id="new-password" type="password" placeholder="••••••••••••" />
                                <Input label="Confirm New Password" id="confirm-password" type="password" placeholder="••••••••••••" />
                                <div className="pt-2 text-right">
                                    <Button type="submit" isLoading={isUpdatingPassword}>Update Password</Button>
                                </div>
                            </form>
                        </div>
                         <div className="bg-white rounded-2xl shadow-md p-8">
                             <h3 className="text-xl font-bold text-slate-800 mb-6">Two-Factor Authentication (2FA)</h3>
                             <div className="space-y-4">
                                <SettingsRow label="Enable 2FA" description="Add an extra layer of security to your account." control={<ToggleSwitch defaultChecked />} />
                                <div className="pt-2">
                                    <Button variant="secondary">Configure 2FA Devices</Button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}
                {activeTab === 'notifications' && (
                     <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h3>
                        <div className="space-y-4">
                            <SettingsRow label="New Lead Assignments" description="Get an email when a new lead is assigned to you." control={<ToggleSwitch defaultChecked />} />
                            <SettingsRow label="Mentions in Chat" description="Receive in-app and email alerts for @mentions." control={<ToggleSwitch defaultChecked />} />
                            <SettingsRow label="Weekly Performance Summary" description="Receive a summary of your stats every Monday." control={<ToggleSwitch />} />
                            <SettingsRow label="Conversion Approvals" description="Get notified when your conversion requests are approved." control={<ToggleSwitch defaultChecked />} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;