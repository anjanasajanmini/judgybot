'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'signup' | 'signin';
}

export default function SignUpModal({ isOpen, onClose, mode = 'signup' }: SignUpModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState(mode);
    const { signUp, signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (authMode === 'signup') {
                await signUp(email, password);
                toast.success('Account created successfully!');
            } else {
                await signIn(email, password);
                toast.success('Signed in successfully!');
            }
            onClose();
        } catch (error: any) {
            console.error('Auth error:', error);
            toast.error(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setAuthMode(prev => prev === 'signup' ? 'signin' : 'signup');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
                        onClick={onClose} 
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 mx-4"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {authMode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                                    </div>
                                ) : (
                                    authMode === 'signup' ? 'Create Account' : 'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                onClick={toggleMode}
                                className="text-sm text-purple-600 hover:text-purple-700"
                            >
                                {authMode === 'signup' 
                                    ? 'Already have an account? Sign in' 
                                    : 'Need an account? Sign up'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
} 