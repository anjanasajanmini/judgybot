'use client';

import { AuthProvider } from '@/lib/contexts/AuthContext';

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
} 