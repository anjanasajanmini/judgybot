'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, Moon, Sun } from 'lucide-react';
import Logo from './Logo';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function Navigation() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
            toast.success('Signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Failed to sign out');
        }
    };

    const handleProfileClick = () => {
        router.push('/profile');
    };

    return (
        <nav className="border-b bg-white/80 backdrop-blur-sm transition-colors">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                    <Logo size="md" />
                </Link>
                {user && (
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleProfileClick}
                            className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-shadow"
                            title="Profile"
                        >
                            <User size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSignOut}
                            className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-shadow"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </motion.button>
                    </div>
                )}
            </div>
        </nav>
    );
} 