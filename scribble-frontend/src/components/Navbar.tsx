import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { room, disconnectFromGame } = useGame();
    const navigate = useNavigate();
    const [muted, setMuted] = React.useState(false);

    const handleLeave = () => {
        disconnectFromGame();
        navigate('/');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="h-16 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between"
        >
            <div className="flex items-center gap-6">
                <div className="font-display font-black text-2xl tracking-widest text-white neon-text cursor-pointer" onClick={() => navigate('/')}>
                    SCRIBBLE
                </div>

                {room && (
                    <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono text-cyan-400">Room: {room.roomCode}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setMuted(!muted)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {room && (
                    <button
                        onClick={handleLeave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors border border-red-500/20"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wider">Leave</span>
                    </button>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
