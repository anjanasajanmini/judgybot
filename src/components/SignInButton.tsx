'use client';

import { useAuth } from '@/lib/contexts/AuthContext';

export default function SignInButton() {
    const { signInWithGoogle } = useAuth();

    return (
        <button
            onClick={signInWithGoogle}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
            Sign In
        </button>
    );
} 