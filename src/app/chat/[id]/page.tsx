'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import ToneSelector from '@/components/chat/ToneSelector';
import { getChatCompletion } from '@/lib/utils/deepseek';
import { saveChat, updateChat, getChat } from '@/lib/utils/firestore';
import type { ChatDocument } from '@/lib/types/chat';
import DocumentHeader from '@/components/chat/DocumentHeader';
import { useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ChatPage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [tone, setTone] = useState('supportive');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState('Untitled Decision');
    const [isSaving, setIsSaving] = useState(false);
    const [keyTakeaways, setKeyTakeaways] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

    useUnsavedChanges(hasUnsavedChanges);

    useEffect(() => {
        // Remove the immediate redirect
        // if (!user) {
        //     router.push('/');
        //     return;
        // }

        // Load existing chat if available
        const loadChat = async () => {
            if (!isInitialized && user) {  // Only load if user exists and not initialized
                try {
                    console.log('Loading chat:', params.id);
                    const existingChat = await getChat(params.id);
                    if (existingChat && existingChat.userId === user.uid) {  // Check if chat belongs to user
                        console.log('Chat found:', existingChat);
                        setMessages(existingChat.messages || []);
                        setTitle(existingChat.title || 'Untitled Decision');
                        setKeyTakeaways(existingChat.keyTakeaways || '');
                    } else {
                        console.log('Creating new chat');
                        const initialData: Omit<ChatDocument, 'id'> = {
                            userId: user.uid,
                            title: 'Untitled Decision',
                            messages: [],
                            keyTakeaways: '',
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        };
                        await saveChat({ ...initialData, id: params.id });
                    }
                    setIsInitialized(true);
                } catch (error) {
                    console.error('Error loading/initializing chat:', error);
                    toast.error('Failed to load chat');
                }
            }
        };

        loadChat();
    }, [user, params.id, isInitialized]);

    // Add a loading state while checking auth
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const generateTitle = async (messages: Array<{ role: string; content: string }>) => {
        try {
            const titlePrompt = {
                role: 'user',
                content: 'Based on our conversation, suggest a creative and quirky title for this document (just the title, no explanation needed).'
            };
            const suggestedTitle = await getChatCompletion([...messages, titlePrompt], 'humorous');
            return suggestedTitle.trim();
        } catch (error) {
            console.error('Error generating title:', error);
            return 'Untitled Decision';
        }
    };

    const generateKeyTakeaways = async (messages: Array<{ role: string; content: string }>) => {
        try {
            const aiResponses = messages
                .filter(msg => msg.role === 'assistant')
                .map(msg => msg.content);
            
            if (aiResponses.length === 0) return '';

            const takeawaysPrompt = {
                role: 'user',
                content: 'Summarize the key points from our discussion in a few bullet points.'
            };

            const generatedTakeaways = await getChatCompletion([
                { role: 'system', content: 'You are creating a natural summary of the conversation.' },
                { role: 'user', content: aiResponses.join('\n\n') },
                takeawaysPrompt
            ], tone); // Use the same tone as the conversation

            return generatedTakeaways
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map(line => line.startsWith('-') ? line : `- ${line}`)
                .join('\n');
        } catch (error) {
            console.error('Error in generateKeyTakeaways:', error);
            return '';
        }
    };

    const handleSave = async () => {
        if (!user) return;
        
        setIsSaving(true);
        try {
            const chatData: Omit<ChatDocument, 'id'> = {
                userId: user.uid,
                title,
                messages,
                keyTakeaways,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            await saveChat(chatData);
            setHasUnsavedChanges(false);
            setLastSavedAt(Date.now());
            toast.success('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving:', error);
            setError('Failed to save document');
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendMessage = async (message: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const newMessages = [...messages, { role: 'user', content: message }];
            setMessages(newMessages);

            // Updated system message to enforce more natural, concise responses
            const systemMessage = {
                role: 'system',
                content: `Respond naturally and match the user's tone and brevity. 
                - If user is brief, be brief
                - No unnecessary formatting or sections
                - No "actionable advice" or "key takeaways" unless specifically requested
                - Match the conversation flow naturally`
            };

            const aiResponse = await getChatCompletion([systemMessage, ...newMessages], tone);
            const updatedMessages = [...newMessages, { role: 'assistant', content: aiResponse }];
            setMessages(updatedMessages);

            // Save to Firestore
            if (user && isInitialized) {
                const updateData = {
                    messages: updatedMessages,
                    title,
                    keyTakeaways,
                    updatedAt: Date.now()
                };
                await updateChat(params.id, updateData);
                setLastSavedAt(Date.now());
            }
        } catch (err) {
            console.error('Error in handleSendMessage:', err);
            setError('Failed to get response. Please try again.');
            setHasUnsavedChanges(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <DocumentHeader 
                title={title} 
                setTitle={setTitle}
                isSaving={isSaving}
                lastSavedAt={lastSavedAt}
            />
            
            <div className="flex-1 relative">
                {/* Background decoration */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                    
                    {/* Add the logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
                        <Image
                            src="/robot-logo.png"
                            alt="JudgyBot Logo"
                            width={400}
                            height={400}
                            className="select-none pointer-events-none"
                        />
                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-4 space-y-4">
                    <ChatMessages messages={messages} />
                    {isLoading && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center p-4"
                        >
                            <div className="animate-pulse text-gray-500 font-mono">
                                Judging your life choices... 🤔
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Fixed bottom section */}
            <div className="sticky bottom-0 border-t backdrop-blur-sm bg-white/50 pt-2">
                <div className="max-w-4xl mx-auto px-4">
                    <ToneSelector selectedTone={tone} onToneChange={setTone} />
                    <div className="pb-4">
                        <ChatInput 
                            onSendMessage={handleSendMessage}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 