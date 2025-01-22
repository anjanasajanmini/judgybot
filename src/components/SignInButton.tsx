'use client';

import { useAuth } from '@/lib/contexts/AuthContext';

export default function SignInButton() {
    const { signInWithGoogle } = useAuth();

    return (
        <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-blue-500 text-white dark:bg-blue-600 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
            Sign In
        </button>
    );
} 