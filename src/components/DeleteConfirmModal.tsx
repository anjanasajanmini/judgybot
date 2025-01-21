'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    isBulkDelete?: boolean;
}

export default function DeleteConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title,
    isBulkDelete 
}: DeleteConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/50 z-50" 
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-lg shadow-xl p-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isBulkDelete ? 'Delete Multiple Documents' : 'Delete Document'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600">
                                {isBulkDelete 
                                    ? `Are you sure you want to delete ${title}? This action cannot be undone.`
                                    : `Are you sure you want to delete "${title}"? This action cannot be undone.`
                                }
                            </p>
                            {isBulkDelete && (
                                <div className="mt-4 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-md">
                                    <AlertCircle size={20} className="mt-0.5" />
                                    <p className="text-sm">
                                        You are about to delete multiple documents. This action is permanent and cannot be reversed.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 