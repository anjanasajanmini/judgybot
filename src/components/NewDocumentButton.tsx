'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

export default function NewDocumentButton() {
    const { user } = useAuth();

    if (!user) return null;

    const chatId = Date.now().toString();

    return (
        <Link href={`/chat/${chatId}`}>
            <button 
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
                New Document
            </button>
        </Link>
    );
} 