import React, { useState } from 'react';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import Button from '../../components/ui/Button';
import BellIcon from '../../components/icons/BellIcon';
import MoonIcon from '../../components/icons/MoonIcon';
import SunIcon from '../../components/icons/SunIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import DownloadCloudIcon from '../../components/icons/DownloadCloudIcon';

const SettingsPage: React.FC = () => {
    const [theme, setTheme] = useState('System');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Settings & Preferences</h1>
                <p className="text-slate-500 mt-1">Customize your experience and manage your account.</p>
            </div>

            <div className="space-y-8">
                {/* Theme Card */}
                <div className="bg-white rounded-2xl shadow-md p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Theme</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ThemeOption icon={<SunIcon className="w-6 h-6" />} label="Light" selected={theme === 'Light'} onClick={() => setTheme('Light')} />
                        <ThemeOption icon={<MoonIcon className="w-6 h-6" />} label="Dark" selected={theme === 'Dark'} onClick={() => setTheme('Dark')} />
                        <ThemeOption icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 1 0 10 10"/></svg>} label="System" selected={theme === 'System'} onClick={() => setTheme('System')} />
                    </div>
                </div>

                {/* Account Management Card */}
                <div className="bg-white rounded-2xl shadow-md p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Account Management</h3>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold text-slate-700">Export Your Data</h4>
                                <p className="text-sm text-slate-500">Download a copy of all your account data.</p>
                            </div>
                            {/* FIX: Set button size to 'sm' for a more compact UI within the settings row. */}
                            <Button size="sm" variant="secondary" leftIcon={<DownloadCloudIcon className="w-5 h-5" />}>Export</Button>
                        </div>
                         <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-200 rounded-lg">
                            <div>
                                <h4 className="font-semibold text-red-800">Delete Your Account</h4>
                                <p className="text-sm text-red-600">This action is permanent and cannot be undone.</p>
                            </div>
                            {/* FIX: Set button size to 'sm' for a more compact UI within the settings row. */}
                            <Button size="sm" variant="secondary" className="!border-red-300 !text-red-700 hover:!bg-red-100" leftIcon={<TrashIcon className="w-5 h-5" />}>Delete</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ThemeOptionProps {
    icon: React.ReactNode;
    label: string;
    selected: boolean;
    onClick: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ icon, label, selected, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 ${selected ? 'border-yellow-400 bg-yellow-50 text-yellow-900 shadow-md' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
        {icon}
        <span className="font-semibold mt-2">{label}</span>
    </button>
);

export default SettingsPage;