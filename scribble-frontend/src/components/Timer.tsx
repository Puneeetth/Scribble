import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
    timeLeft: number;
    totalTime?: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime = 60 }) => {
    const percentage = (timeLeft / totalTime) * 100;

    // Color transitions based on time left
    const getColor = () => {
        if (percentage > 50) return 'text-green-400 stroke-green-400';
        if (percentage > 20) return 'text-yellow-400 stroke-yellow-400';
        return 'text-red-500 stroke-red-500 animate-pulse';
    };

    const getShadow = () => {
        if (percentage > 50) return 'drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]';
        if (percentage > 20) return 'drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]';
        return 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]';
    };

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative flex items-center justify-center w-16 h-16 ${getShadow()}`}>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                {/* Background circle */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    className="stroke-slate-800 fill-none"
                    strokeWidth="4"
                />
                {/* Progress circle */}
                <motion.circle
                    cx="24"
                    cy="24"
                    r={radius}
                    className={`fill-none ${getColor()} transition-colors duration-300`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "linear" }}
                />
            </svg>
            <div className={`z-10 font-display font-black text-xl ${getColor().split(' ')[0]}`}>
                {timeLeft}
            </div>
        </div>
    );
};

export default Timer;
