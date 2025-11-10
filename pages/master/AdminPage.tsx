import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import ToggleSwitch from '../../components/ui/ToggleSwitch';
import BrainCircuitIcon from '../../components/icons/BrainCircuitIcon';
import ShieldIcon from '../../components/icons/ShieldIcon';
import ServerIcon from '../../components/icons/ServerIcon';
import CreditCardIcon from '../../components/icons/CreditCardIcon';

// Helper component for settings cards
const SettingsCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; delay: number }> = ({ title, icon, children, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            {icon}
            {title}
        </h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// Helper for individual settings rows
const SettingsRow: React.FC<{ label: string; description: string; control: React.ReactNode }> = ({ label, description, control }) => (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
        <div>
            <h4 className="font-semibold text-slate-700">{label}</h4>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div>{control}</div>
    </div>
);

const MasterAdminPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateBackup = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">System Administration</h1>
                <p className="text-slate-500 mt-1">Platform configuration and maintenance controls.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Configuration */}
                <SettingsCard title="AI Configuration" icon={<BrainCircuitIcon className="w-6 h-6 text-indigo-500" />} delay={100}>
                    <SettingsRow
                        label="Lead Scoring Model"
                        description="Select the AI model for lead qualification."
                        control={
                            <select className="bg-slate-100 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 p-2">
                                <option>Gemini 2.5 Pro</option>
                                <option>Gemini 2.5 Flash</option>
                            </select>
                        }
                    />
                    <SettingsRow
                        label="Email Generation Model"
                        description="Model used for the AI Email Composer."
                        control={
                            <select className="bg-slate-100 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 p-2">
                                <option>Gemini 2.5 Flash</option>
                                <option>Gemini 2.5 Pro</option>
                            </select>
                        }
                    />
                    <div className="pt-2 text-right">
                        {/* FIX: Set button size to 'sm' for a more compact UI within the settings card. */}
                        <Button size="sm" variant="secondary">Reset to Defaults</Button>
                    </div>
                </SettingsCard>

                {/* System Maintenance */}
                <SettingsCard title="System Maintenance" icon={<ServerIcon className="w-6 h-6 text-slate-500" />} delay={200}>
                    <SettingsRow
                        label="Enable Maintenance Mode"
                        description="Temporarily disable access for non-admins."
                        control={<ToggleSwitch />}
                    />
                    <SettingsRow
                        label="System Logs"
                        description="View detailed application and event logs."
                        /* FIX: Set button size to 'sm' for a more compact UI within the settings row. */
                        control={<Button size="sm" variant="secondary">View Logs</Button>}
                    />
                    <SettingsRow
                        label="Create System Backup"
                        description="Generate a full backup of the database."
                        /* FIX: Set button size to 'sm' for a more compact UI within the settings row. */
                        control={<Button size="sm" isLoading={isLoading} onClick={handleCreateBackup}>Create Backup</Button>}
                    />
                </SettingsCard>

                {/* Billing & Plan */}
                <SettingsCard title="Billing & Plan" icon={<CreditCardIcon className="w-6 h-6 text-green-500" />} delay={300}>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-slate-700">Current Plan</p>
                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                        </div>
                        <p className="text-2xl font-bold text-indigo-600">Enterprise AI Suite</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600">Monthly AI API Calls</label>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-slate-500 text-right mt-1">75,230 / 100,000</p>
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                        {/* FIX: Set button size to 'sm' for a more compact UI within the settings card. */}
                        <Button size="sm" variant="secondary">View Invoices</Button>
                        {/* FIX: Set button size to 'sm' for a more compact UI within the settings card. */}
                        <Button size="sm">Manage Plan</Button>
                    </div>
                </SettingsCard>

                {/* Security */}
                <SettingsCard title="Security" icon={<ShieldIcon className="w-6 h-6 text-red-500" />} delay={400}>
                     <SettingsRow
                        label="Enforce Two-Factor Auth (2FA)"
                        description="Require all users to set up 2FA."
                        control={<ToggleSwitch defaultChecked />}
                    />
                     <SettingsRow
                        label="Session Timeout (minutes)"
                        description="Automatically log out inactive users."
                        control={<input type="number" defaultValue="60" className="w-24 bg-slate-100 border-none rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 p-2 text-center" />}
                    />
                    <div className="p-4 bg-red-50/50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-red-800">Clear All User Sessions</h4>
                                <p className="text-sm text-red-600">This will log out everyone immediately.</p>
                            </div>
                            {/* FIX: Set button size to 'sm' for a more compact UI within the settings row. */}
                            <Button size="sm" variant="secondary" className="!border-red-300 !text-red-700 hover:!bg-red-100">Force Logout</Button>
                        </div>
                    </div>
                </SettingsCard>
            </div>
        </div>
    );
};

export default MasterAdminPage;
