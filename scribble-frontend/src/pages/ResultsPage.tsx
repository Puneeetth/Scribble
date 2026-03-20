import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Home, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import AnimatedBackground from '../components/AnimatedBackground';
import GlowButton from '../components/GlowButton';

const ResultsPage: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { room, currentUser, gameState, disconnectFromGame } = useGame();

    // Redirect if no context
    useEffect(() => {
        if (!currentUser || !room) {
            navigate('/');
        }
    }, [currentUser, room, navigate]);

    if (!room || !currentUser) return null;

    // Use game state if available, else fallback to room players
    const players = gameState?.players || room.players || [];

    // Sort players by score descending
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    const winner = sortedPlayers[0];
    const secondPlace = sortedPlayers[1];
    const thirdPlace = sortedPlayers[2];

    const others = sortedPlayers.slice(3);

    const handleHome = () => {
        disconnectFromGame();
        navigate('/');
    };

    const handlePlayAgain = () => {
        // In a real app, this would reset state and go back to lobby
        navigate(`/lobby/${roomCode}`);
    };

    const isHost = currentUser.isHost;

    return (
        <div className="relative min-h-screen p-6 overflow-hidden flex flex-col items-center">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="z-10 w-full max-w-4xl flex flex-col items-center"
            >

                {/* Title */}
                <div className="text-center mb-12">
                    <h1 className="text-6xl font-display font-black text-white tracking-widest uppercase neon-text mb-4">
                        Game Over!
                    </h1>
                    <p className="text-xl text-purple-300 font-mono tracking-widest">
                        Room Code: <span className="font-bold text-cyan-400">{roomCode}</span>
                    </p>
                </div>

                {/* Podium */}
                <div className="flex items-end justify-center w-full max-w-2xl gap-4 sm:gap-8 mb-16 h-64">

                    {/* 2nd Place */}
                    {secondPlace && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex flex-col items-center flex-1"
                        >
                            <div className="text-center mb-4">
                                <Medal className="w-8 h-8 text-slate-300 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(203,213,225,0.8)]" />
                                <h3 className="font-bold text-white text-lg">{secondPlace.userName}</h3>
                                <p className="text-cyan-400 font-mono font-bold">{secondPlace.score} pts</p>
                            </div>
                            <div className="w-full h-32 bg-slate-800/80 border-t-4 border-slate-300 rounded-t-xl relative overflow-hidden flex justify-center items-end pb-4 shadow-[0_0_20px_rgba(203,213,225,0.2)]">
                                <div className="absolute inset-0 bg-gradient-to-b from-slate-400/20 to-transparent" />
                                <span className="font-display text-4xl font-black text-slate-500/50">2</span>
                            </div>
                        </motion.div>
                    )}

                    {/* 1st Place */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="flex flex-col items-center flex-1 relative z-10"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-12 z-20"
                        >
                            <Crown className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,1)]" />
                        </motion.div>

                        <div className="text-center mb-4 relative z-10">
                            <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                            <h3 className="font-bold text-white text-2xl neon-text">{winner?.userName}</h3>
                            <p className="text-yellow-400 font-mono font-bold text-xl">{winner?.score} pts</p>
                        </div>
                        <div className="w-full h-40 bg-purple-900/80 border-t-4 border-yellow-400 rounded-t-xl relative overflow-hidden flex justify-center items-end pb-4 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent" />
                            <span className="font-display text-5xl font-black text-purple-950/50">1</span>
                        </div>
                    </motion.div>

                    {/* 3rd Place */}
                    {thirdPlace && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col items-center flex-1"
                        >
                            <div className="text-center mb-4">
                                <Medal className="w-8 h-8 text-amber-700 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(180,83,9,0.8)]" />
                                <h3 className="font-bold text-white text-lg">{thirdPlace.userName}</h3>
                                <p className="text-cyan-400 font-mono font-bold">{thirdPlace.score} pts</p>
                            </div>
                            <div className="w-full h-24 bg-slate-800/80 border-t-4 border-amber-700 rounded-t-xl relative overflow-hidden flex justify-center items-end pb-4 shadow-[0_0_20px_rgba(180,83,9,0.2)]">
                                <div className="absolute inset-0 bg-gradient-to-b from-amber-700/20 to-transparent" />
                                <span className="font-display text-4xl font-black text-slate-500/50">3</span>
                            </div>
                        </motion.div>
                    )}

                </div>

                {/* Other Players */}
                {others.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="w-full max-w-xl glass-card-strong p-6 mb-12"
                    >
                        <h4 className="text-sm font-display tracking-widest font-bold text-slate-400 uppercase mb-4 border-b border-slate-700 pb-2">
                            Runners Up
                        </h4>
                        <div className="space-y-3">
                            {others.map((player, idx) => (
                                <div key={player.userName} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-slate-500 w-6 text-right">{idx + 4}.</span>
                                        <span className="font-bold text-slate-200">{player.userName}</span>
                                    </div>
                                    <span className="font-mono text-cyan-400">{player.score} pts</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
                >
                    {isHost && (
                        <GlowButton
                            onClick={handlePlayAgain}
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Play Again
                        </GlowButton>
                    )}

                    <button
                        onClick={handleHome}
                        className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg border border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-white font-display tracking-widest font-bold uppercase transition-all duration-300 ${!isHost && 'flex-1'}`}
                    >
                        <Home className="w-5 h-5" />
                        Home
                    </button>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default ResultsPage;
