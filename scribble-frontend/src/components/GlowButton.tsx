import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlowButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
}

const GlowButton: React.FC<GlowButtonProps> = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}) => {
    const getColors = () => {
        switch (variant) {
            case 'primary': return 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] shadow-purple-500';
            case 'secondary': return 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] shadow-cyan-500';
            case 'danger': return 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] shadow-red-500';
            default: return 'bg-purple-600 hover:bg-purple-500';
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative overflow-hidden font-display tracking-wider uppercase font-bold text-white py-3 px-8 rounded-lg transition-all duration-300 ${getColors()} ${className}`}
            {...props}
        >
            <div className="absolute inset-0 w-full h-full bg-white/20 blur-md transform -skew-x-12 -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default GlowButton;
