import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Users, Play, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import AnimatedBackground from '../components/AnimatedBackground';
import PlayerCard from '../components/PlayerCard';
import GlowButton from '../components/GlowButton';
import { wsService } from '../services/websocket';

const LobbyPage: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { room, currentUser, connectToGame, isConnected, gameState } = useGame();

    const [copied, setCopied] = React.useState(false);

    useEffect(() => {
        // If no context exists (e.g. direct URL access), redirect to join
        if (!currentUser || !room) {
            navigate('/join');
            return;
        }

        if (roomCode && !isConnected) {
            connectToGame(roomCode);
        }
    }, [currentUser, room, roomCode, isConnected, connectToGame, navigate]);

    useEffect(() => {
        // Watch game state for transitions to PLAYING
        if (gameState?.roundActive) {
            navigate(`/game/${roomCode}`);
        }
    }, [gameState, navigate, roomCode]);

    const copyCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleStartGame = () => {
        wsService.startGame();
        navigate(`/game/${roomCode}`);
    };

    if (!room || !currentUser) return null;

    // Use game state players if available (real-time updates), else fallback to initial room players
    const players = gameState?.players || room.players || [];
    const isHost = currentUser.isHost;

    return (
        <div className="relative min-h-screen p-6 overflow-hidden flex flex-col">
            <AnimatedBackground />

            {/* Header Info */}
            <div className="z-10 w-full max-w-5xl mx-auto mb-8 mt-4 flex items-center justify-between">
                <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase neon-text">
                    Scribble
                </h1>

                <div className="flex items-center gap-4">
                    <div className="glass-card px-6 py-2 flex items-center gap-4">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Room Code</p>
                            <p className="font-mono text-xl font-bold text-cyan-400 tracking-widest">{roomCode}</p>
                        </div>
                        <button
                            onClick={copyCode}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group relative"
                            title="Copy Room Code"
                        >
                            <Copy className="w-5 h-5 text-slate-300 group-hover:text-white" />
                            {copied && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    Copied!
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="z-10 flex-1 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

                {/* Left Col - Settings/Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card-strong p-6">
                        <div className="flex items-center gap-3 border-b border-slate-700 pb-4 mb-4">
                            <AlertCircle className="w-5 h-5 text-purple-400" />
                            <h2 className="font-display tracking-widest font-bold text-white uppercase">Status</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-slate-300">
                                    {isConnected ? "Connected to Server" : "Connecting..."}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Waiting for the host to start the game. Share the room code to invite more players!
                            </p>
                        </div>

                        {isHost && (
                            <div className="mt-8 pt-6 border-t border-slate-700">
                                <GlowButton
                                    onClick={handleStartGame}
                                    className="w-full flex items-center justify-center gap-2"
                                    disabled={players.length < 2}
                                >
                                    <Play className="w-5 h-5" />
                                    Start Game
                                </GlowButton>
                                {players.length < 2 && (
                                    <p className="text-xs text-red-400 mt-3 text-center">
                                        Need at least 2 players to start
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

        /* Right Col - Player List */
                <div className="lg:col-span-2 glass-card-strong p-6 flex flex-col h-[600px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-cyan-400" />
                            <h2 className="text-xl font-display tracking-widest font-bold text-white uppercase">Players</h2>
                        </div>
                        <span className="bg-slate-800 px-3 py-1 rounded-full text-sm font-mono text-cyan-400 border border-slate-700">
                            {players.length} / 10
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4">
                        <AnimatePresence>
                            {players.map((player) => (
                                <PlayerCard key={player.userName} player={player} />
                            ))}
                        </AnimatePresence>

                        {/* Loading placeholder for empty slots */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="border-2 border-dashed border-slate-700/50 rounded-xl p-4 flex items-center justify-center h-20 bg-slate-800/20"
                        >
                            <div className="flex items-center gap-3 text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-slate-500 animate-[bounce_1s_infinite_0ms]" />
                                <div className="w-2 h-2 rounded-full bg-slate-500 animate-[bounce_1s_infinite_200ms]" />
                                <div className="w-2 h-2 rounded-full bg-slate-500 animate-[bounce_1s_infinite_400ms]" />
                                <span className="ml-2 text-sm uppercase tracking-wider">Waiting for players</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LobbyPage;
