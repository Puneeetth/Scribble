import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Brush } from 'lucide-react';
import { Player } from '../types';

interface PlayerCardProps {
    player: Player;
    isCurrentDrawer?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isCurrentDrawer = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            layout
            className={`relative rounded-xl p-4 flex items-center gap-4 transition-all duration-300
        ${player.isHost ? 'bg-purple-900/40 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-slate-800/60 border border-slate-700 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'}`}
        >
            {/* Avatar Avatar */}
            <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-xl
          ${player.isHost ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white'
                        : 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-slate-900'}`}
                >
                    {player.userName.charAt(0).toUpperCase()}
                </div>

                {player.isHost && (
                    <div className="absolute -top-2 -right-2 bg-slate-900 p-1 rounded-full text-yellow-500 animate-[bounce_2s_infinite]">
                        <Crown className="w-4 h-4" />
                    </div>
                )}

                {isCurrentDrawer && (
                    <div className="absolute -top-2 -left-2 bg-slate-900 p-1 rounded-full text-pink-500">
                        <Brush className="w-4 h-4 animate-pulse" />
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white tracking-wide">{player.userName}</h3>
                    {player.isHost && (
                        <span className="text-[10px] uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                            Host
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-400 font-mono mt-1">
                    Score: <span className="text-cyan-400 font-bold">{player.score}</span>
                </p>
            </div>
        </motion.div>
    );
};

export default PlayerCard;
