'use client';

import { motion } from 'framer-motion';
import UserProfile from '@/components/profile/UserProfile';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto px-4"
            >
                <div className="relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-6 left-6 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

                    <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-purple-100">
                        <UserProfile />
                    </div>
                </div>
            </motion.div>
        </div>
    );
} 