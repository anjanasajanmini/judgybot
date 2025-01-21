'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function NewChat() {
    const router = useRouter();

    useEffect(() => {
        // Generate a new unique ID and redirect to that chat
        const newChatId = uuidv4();
        router.push(`/chat/${newChatId}`);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
    );
} 