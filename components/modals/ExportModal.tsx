import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { exportDataAsFile } from '../../utils/export';
import DownloadCloudIcon from '../icons/DownloadCloudIcon';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDataSources: string[];
  initialSelectedData: string[];
  data: { [key: string]: any[] };
}

type ExportFormat = 'csv' | 'json';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, availableDataSources, initialSelectedData, data }) => {
    const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set(initialSelectedData));
    const [format, setFormat] = useState<ExportFormat>('csv');
    const [isExporting, setIsExporting] = useState(false);

    const handleSourceToggle = (source: string) => {
        const newSelection = new Set(selectedSources);
        if (newSelection.has(source)) {
            newSelection.delete(source);
        } else {
            newSelection.add(source);
        }
        setSelectedSources(newSelection);
    };

    const handleExport = () => {
        setIsExporting(true);
        // In a real app with multiple sources, you might zip them. Here we'll export one by one.
        selectedSources.forEach(source => {
            if (data[source]) {
                const timestamp = new Date().toISOString().slice(0, 10);
                exportDataAsFile(data[source], `${source}_export_${timestamp}`, format);
            }
        });

        setTimeout(() => {
            setIsExporting(false);
            onClose();
        }, 1000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Export Data</h2>
                <p className="text-slate-500 mb-6">Select the data and format you want to export.</p>
                
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Data Sources</h4>
                        <div className="space-y-2">
                            {availableDataSources.map(source => (
                                <label key={source} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedSources.has(source)}
                                        onChange={() => handleSourceToggle(source)}
                                    />
                                    <span className="font-medium text-slate-800">{source}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Export Format</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFormat('csv')}
                                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-colors ${format === 'csv' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                                CSV
                            </button>
                             <button
                                onClick={() => setFormat('json')}
                                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-colors ${format === 'json' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                                JSON
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="button" onClick={handleExport} isLoading={isExporting} disabled={selectedSources.size === 0} leftIcon={<DownloadCloudIcon className="w-4 h-4"/>}>
                        Export Data
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ExportModal;
