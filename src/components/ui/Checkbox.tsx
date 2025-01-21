'use client';

import { Check } from 'lucide-react';

interface CheckboxProps {
    checked?: boolean;
    className?: string;
}

export default function Checkbox({ checked, className = '' }: CheckboxProps) {
    return (
        <div 
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                checked 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-transparent' 
                    : 'border-gray-300'
            } ${className}`}
        >
            {checked && <Check size={14} className="text-white" />}
        </div>
    );
} 