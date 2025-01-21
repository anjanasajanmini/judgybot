'use client';

import { motion } from 'framer-motion';

interface ToneSelectorProps {
    selectedTone: string;
    onToneChange: (tone: string) => void;
}

const tones = [
    { id: 'supportive', label: '🤗 Supportive', color: 'bg-green-500' },
    { id: 'critical', label: '🤔 Critical', color: 'bg-red-500' },
    { id: 'humorous', label: '😄 Humorous', color: 'bg-yellow-500' },
    { id: 'direct', label: '⚡ Direct', color: 'bg-blue-500' },
];

export default function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
    return (
        <div className="flex flex-wrap gap-2 justify-center mb-3">
            {tones.map((tone, index) => (
                <motion.button
                    key={tone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToneChange(tone.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedTone === tone.id
                            ? `${tone.color} text-white shadow-lg`
                            : 'bg-white/80 hover:bg-white text-gray-700 shadow'
                    }`}
                >
                    {tone.label}
                </motion.button>
            ))}
        </div>
    );
} 