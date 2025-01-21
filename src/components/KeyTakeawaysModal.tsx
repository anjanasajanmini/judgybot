'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';

interface KeyTakeawaysModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    keyTakeaways: string;
}

export default function KeyTakeawaysModal({ 
    isOpen, 
    onClose, 
    title,
    keyTakeaways 
}: KeyTakeawaysModalProps) {
    // Function to format bullet points with emojis
    const formatTakeaways = (text: string) => {
        if (!text) return '';
        // Split by newlines and format each line
        return text.split('\n')
            .map(line => {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                    // Add some styling to bullet points
                    return `<div class="flex items-start gap-3 mb-4">
                        <span class="text-purple-500 text-2xl leading-none">•</span>
                        <span class="flex-1 text-lg">${trimmedLine.substring(1).trim()}</span>
                    </div>`;
                }
                return line ? `<p class="mb-4 text-lg">${line}</p>` : '';
            })
            .filter(Boolean) // Remove empty lines
            .join('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center" style={{ minHeight: '100vh' }}>
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl"
                        style={{ maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white px-8 pt-8 pb-4 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-purple-500 w-7 h-7" />
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        Summary: {title}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                            <div className="prose prose-lg prose-purple max-w-none">
                                {keyTakeaways ? (
                                    <div 
                                        className="space-y-1 text-gray-700"
                                        dangerouslySetInnerHTML={{ 
                                            __html: formatTakeaways(keyTakeaways)
                                        }} 
                                    />
                                ) : (
                                    <p className="text-gray-500 italic text-center text-lg">
                                        No summary available yet. The AI was probably too busy judging... 😅
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
} 