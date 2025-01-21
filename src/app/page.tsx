'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import SignUpModal from '@/components/SignUpModal';

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signin');

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleAuthClick = (mode: 'signup' | 'signin') => {
        setAuthMode(mode);
        setShowAuth(true);
    };

    if (user) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Background decoration - Move this before the content and lower z-index */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main content - Add positive z-index */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center relative z-10"
            >
                <Logo size="lg" />
                <p className="mt-4 text-lg text-gray-600">
                    Your Personal Judgment Zone
                </p>
                <motion.p 
                    className="text-xl text-gray-800 mb-8 font-mono italic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    When you need more than a gut feeling, like an AI verdict :P
                </motion.p>

                <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAuthClick('signin')}
                        className="px-8 py-3 bg-white/90 text-indigo-600 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold backdrop-blur-sm"
                    >
                        Sign In
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAuthClick('signup')}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
                    >
                        Sign Up
                    </motion.button>
                </motion.div>
            </motion.div>

            <SignUpModal 
                isOpen={showAuth} 
                onClose={() => setShowAuth(false)} 
                mode={authMode}
            />
        </div>
    );
}
