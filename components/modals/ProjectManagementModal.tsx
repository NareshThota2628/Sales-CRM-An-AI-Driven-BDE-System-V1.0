import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SettingsIcon from '../icons/SettingsIcon';
import UsersIcon from '../icons/UsersIcon';
import GitBranchIcon from '../icons/GitBranchIcon';
import Input from '../ui/Input';

interface ProjectData {
  name: string;
  label: string;
  members: { id: string; name: string; avatar: string; role: string }[];
  history: { user: string; action: string; time: string }[];
}

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'settings' | 'members' | 'history';
  projectData: ProjectData;
  onProjectDataChange: (newData: Partial<ProjectData>) => void;
}

const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({ isOpen, onClose, initialTab, projectData, onProjectDataChange }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [projectName, setProjectName] = useState(projectData.name);
    const [projectLabel, setProjectLabel] = useState(projectData.label);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setProjectName(projectData.name);
            setProjectLabel(projectData.label);
        }
    }, [isOpen, initialTab, projectData]);
    
    const handleSaveChanges = () => {
        onProjectDataChange({ name: projectName, label: projectLabel });
        onClose();
    };

    const TabButton: React.FC<{ tabId: typeof activeTab; icon: React.ReactNode; label: string }> = ({ tabId, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === tabId ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
        >
            {icon} {label}
        </button>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Project Management</h2>
                <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
                    <TabButton tabId="settings" icon={<SettingsIcon className="w-4 h-4" />} label="Settings" />
                    <TabButton tabId="members" icon={<UsersIcon className="w-4 h-4" />} label="Members" />
                    <TabButton tabId="history" icon={<GitBranchIcon className="w-4 h-4" />} label="History" />
                </div>
                
                {activeTab === 'settings' && (
                    <div className="space-y-4">
                        <Input label="Project Name" id="project-name" value={projectName} onChange={e => setProjectName(e.target.value)} />
                        <Input label="Project Label" id="project-label" value={projectLabel} onChange={e => setProjectLabel(e.target.value)} />
                         <div className="pt-4 flex justify-end gap-3">
                            <Button variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </div>
                    </div>
                )}
                {activeTab === 'members' && (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {projectData.members.map(member => (
                             <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-slate-800">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.role}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary">Remove</Button>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'history' && (
                     <div className="space-y-3 max-h-80 overflow-y-auto">
                        {projectData.history.map((item, index) => (
                             <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2"></div>
                                <div>
                                    <p className="text-sm text-slate-700"><span className="font-semibold">{item.user}</span> {item.action}</p>
                                    <p className="text-xs text-slate-500">{item.time}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ProjectManagementModal;
