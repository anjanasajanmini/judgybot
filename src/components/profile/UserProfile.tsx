'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { updateProfile } from 'firebase/auth';
import { Sun, Moon, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UserProfile() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user) return;
        
        setIsSaving(true);
        try {
            await updateProfile(user, {
                displayName: displayName
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Display Name
                        </label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                                >
                                    <Save size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-900 dark:text-gray-100">
                                    {user?.displayName || 'No name set'}
                                </span>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Theme
                        </span>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {theme === 'light' ? (
                                <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                            ) : (
                                <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 