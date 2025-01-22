'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ChatMessagesProps {
    messages: Array<{ role: string; content: string }>;
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
    return (
        <div className="space-y-6">
            {messages.map((message, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === 'user'
                                ? 'bg-indigo-600 text-white ml-12'
                                : 'bg-white/80 backdrop-blur-sm border border-purple-100 text-gray-900 mr-12'
                        }`}
                    >
                        <ReactMarkdown className="prose prose-sm max-w-none">
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            ))}
        </div>
    );
} 