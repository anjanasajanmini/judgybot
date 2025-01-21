'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FileText, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { getUserChats, deleteChat } from '@/lib/utils/firestore';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import Checkbox from '@/components/ui/Checkbox';
import KeyTakeawaysModal from '@/components/KeyTakeawaysModal';
import Logo from '@/components/Logo';
import type { ChatDocument } from '@/lib/types/chat';

const motivationalQuotes = [
    "What's the big question today?",
    "Ready to make some decisions?",
    "Let's think this through together.",
    "Time to get some clarity!",
];

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [documents, setDocuments] = useState<ChatDocument[]>([]);
    const [quote, setQuote] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<ChatDocument | null>(null);
    const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
    const [showTakeaways, setShowTakeaways] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<ChatDocument | null>(null);
    const [loadingChat, setLoadingChat] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/');
            return;
        }
        
        // Set random quote
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setQuote(randomQuote);

        // Fetch user's documents
        const loadDocuments = async () => {
            try {
                setIsLoading(true);
                const userDocs = await getUserChats(user.uid);
                const sortedDocs = userDocs.sort((a, b) => b.updatedAt - a.updatedAt);
                setDocuments(sortedDocs);
                console.log('Documents loaded:', userDocs.length);
            } catch (error) {
                console.error('Error loading documents:', error);
                toast.error('Failed to load your documents');
            } finally {
                setIsLoading(false);
            }
        };

        loadDocuments();
    }, [user, router, authLoading]);

    const handleSelectDoc = (docId: string) => {
        setSelectedDocs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(docId)) {
                newSet.delete(docId);
            } else {
                newSet.add(docId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedDocs.size === documents.length) {
            setSelectedDocs(new Set());
        } else {
            setSelectedDocs(new Set(documents.map(doc => doc.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedDocs.size === 0) return;

        const docsToDelete = documents.filter(doc => selectedDocs.has(doc.id));
        
        setDocumentToDelete({
            id: Array.from(selectedDocs).join(','),
            title: `${docsToDelete.length} documents`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [],
            userId: user?.uid || '',
            keyTakeaways: ''
        });
        
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!documentToDelete) return;

        try {
            if (documentToDelete.id.includes(',')) {
                // Bulk delete
                const ids = documentToDelete.id.split(',');
                await Promise.all(ids.map(id => deleteChat(id)));
                setDocuments(docs => docs.filter(d => !selectedDocs.has(d.id)));
                setSelectedDocs(new Set());
                toast.success('Documents deleted successfully');
            } else {
                // Single delete
                await deleteChat(documentToDelete.id);
                setDocuments(docs => docs.filter(d => d.id !== documentToDelete.id));
                toast.success('Document deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting document(s):', error);
            toast.error('Failed to delete document(s)');
        } finally {
            setDeleteModalOpen(false);
            setDocumentToDelete(null);
        }
    };

    const handleSingleDelete = (doc: ChatDocument) => {
        setDocumentToDelete(doc);
        setDeleteModalOpen(true);
    };

    const handleFileClick = (doc: ChatDocument) => {
        setSelectedDoc(doc);
        setShowTakeaways(true);
    };

    const handleOpenChat = async (docId: string) => {
        try {
            setLoadingChat(docId);
            console.log('Navigating to chat:', docId);
            // Use window.location for a hard navigation
            window.location.href = `/chat/${docId}`;
        } catch (error) {
            console.error('Navigation error:', error);
            toast.error('Failed to open chat');
            setLoadingChat(null);
        }
    };

    if (!user || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text font-mono mb-2">
                        {quote}
                    </h1>
                </motion.div>

                {isLoading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 mt-12"
                    >
                        Loading your judgments... 🤔
                    </motion.div>
                ) : (
                    <>
                        {documents.length > 0 && (
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleSelectAll}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-white/50 rounded-md"
                                    >
                                        <Checkbox 
                                            checked={selectedDocs.size === documents.length}
                                            className={selectedDocs.size === documents.length ? "text-purple-500" : ""}
                                        />
                                        Select All
                                    </button>
                                    {selectedDocs.size > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            onClick={handleBulkDelete}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                        >
                                            <Trash2 size={16} />
                                            Delete Selected ({selectedDocs.size})
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        )}

                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            {documents.map((doc, index) => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                    }}
                                    className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 border border-purple-100"
                                >
                                    <div className="absolute top-4 left-4">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleSelectDoc(doc.id)}
                                            className={`p-2 rounded-full ${
                                                selectedDocs.has(doc.id) 
                                                    ? 'bg-purple-100 text-purple-600' 
                                                    : 'hover:bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            <Checkbox 
                                                checked={selectedDocs.has(doc.id)}
                                                className={selectedDocs.has(doc.id) ? "text-purple-500" : ""}
                                            />
                                        </motion.button>
                                    </div>

                                    <div className="flex items-start justify-between pl-12">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {doc.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <Calendar size={14} className="mr-1" />
                                                {format(doc.createdAt, 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleSingleDelete(doc)}
                                                className="p-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-purple-50 rounded-full"
                                                title="Delete document"
                                            >
                                                <Trash2 size={18} className="stroke-[url(#btn-gradient)]" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleFileClick(doc)}
                                                className="p-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 hover:bg-purple-50 rounded-full"
                                                title="View key takeaways"
                                            >
                                                <FileText size={18} className="stroke-[url(#btn-gradient)]" />
                                            </motion.button>
                                        </div>
                                    </div>
                                    <a
                                        href={`/chat/${doc.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleOpenChat(doc.id);
                                        }}
                                        disabled={loadingChat === doc.id}
                                        className={`mt-4 block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:shadow-lg transition-all ${
                                            loadingChat === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {loadingChat === doc.id ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Opening...
                                            </div>
                                        ) : (
                                            'Open Chat'
                                        )}
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>

                        {documents.length === 0 && (
                            <motion.div 
                                className="text-center text-gray-500 mt-12 font-mono"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                No documents yet. Time to make some questionable decisions! 😅
                            </motion.div>
                        )}
                    </>
                )}

                <motion.button
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={() => router.push('/chat/new')}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                    <Plus size={24} />
                </motion.button>

                <DeleteConfirmModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setDocumentToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title={documentToDelete?.title || ''}
                    isBulkDelete={documentToDelete?.id.includes(',')}
                />

                <KeyTakeawaysModal
                    isOpen={showTakeaways}
                    onClose={() => {
                        setShowTakeaways(false);
                        setSelectedDoc(null);
                    }}
                    title={selectedDoc?.title || ''}
                    keyTakeaways={selectedDoc?.keyTakeaways || ''}
                />
            </div>
        </div>
    );
} 