'use client';

import { motion } from 'framer-motion';
import { righteous } from '@/lib/fonts';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
    return (
        <motion.h1 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${righteous.className} text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 ${
                size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-xl'
            }`}
        >
            JudgyBot
        </motion.h1>
    );
} 