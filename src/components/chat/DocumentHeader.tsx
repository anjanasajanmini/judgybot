'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface DocumentHeaderProps {
    title: string;
    setTitle: (title: string) => void;
    isSaving: boolean;
    lastSavedAt: number | null;
}

export default function DocumentHeader({ 
    title, 
    setTitle, 
    isSaving,
    lastSavedAt 
}: DocumentHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);

    const handleExport = async () => {
        // TODO: Implement PDF export
        console.log('Export functionality coming soon');
    };

    return (
        <div className="flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                setIsEditing(false);
                            }
                        }}
                        className="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                ) : (
                    <h1 
                        className="text-2xl font-bold cursor-pointer hover:text-blue-600"
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                    </h1>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={handleExport}
                    className="p-2 text-gray-600 hover:text-gray-900"
                    title="Export as PDF"
                >
                    <Download size={20} />
                </button>
                <button
                    onClick={() => {
                        // TODO: Implement save functionality
                        console.log('Save functionality not implemented');
                    }}
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-md ${
                        isSaving 
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
} 