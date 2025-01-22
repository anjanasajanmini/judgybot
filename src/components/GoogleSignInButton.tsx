'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Image from 'next/image';

export default function GoogleSignInButton() {
    const { signInWithGoogle } = useAuth();

    return (
        <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow hover:shadow-md transition-all border dark:border-gray-700"
        >
            <Image
                src="/google.svg"
                alt="Google logo"
                width={20}
                height={20}
            />
            Sign in with Google
        </button>
    );
} 