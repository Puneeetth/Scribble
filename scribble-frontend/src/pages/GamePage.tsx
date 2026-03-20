import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Navbar from '../components/Navbar';
import DrawingCanvas from '../components/DrawingCanvas';
import ChatPanel from '../components/ChatPanel';
import Timer from '../components/Timer';
import PlayerCard from '../components/PlayerCard';

const GamePage: React.FC = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { room, currentUser, gameState } = useGame();

    // Redirect if no context
    useEffect(() => {
        if (!currentUser || !room) {
            navigate('/join');
        }
    }, [currentUser, room, navigate]);

    if (!room || !currentUser) return null;

    // Use game state if available, otherwise fallback to local defaults for UI testing
    const players = gameState?.players || room.players || [];
    const currentDrawerIndex = gameState?.currentDrawerIndex || 0;
    const isDrawer = players[currentDrawerIndex]?.userName === currentUser.userName;
    const currentWord = gameState?.currentWord || "APPLE";
    const timeLeft = gameState?.timeLeft || 45;

    return (
        <div className="relative min-h-screen bg-slate-950 flex flex-col">
            <Navbar />

            <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-[1600px] w-full mx-auto">

                {/* Left Column - Players */}
                <div className="hidden lg:flex flex-col gap-3 overflow-y-auto pr-2">
                    {players.map((player, idx) => (
                        <PlayerCard
                            key={player.userName}
                            player={player}
                            isCurrentDrawer={idx === currentDrawerIndex}
                        />
                    ))}
                </div>

                {/* Middle Column - Canvas & Game Info */}
                <div className="lg:col-span-2 flex flex-col gap-4">

                    {/* Top Info Bar */}
                    <div className="glass-card flex items-center justify-between p-4 h-24">
                        <Timer timeLeft={timeLeft} totalTime={60} />

                        <div className="flex-1 flex flex-col items-center justify-center">
                            <span className="text-sm text-slate-400 font-display tracking-widest uppercase mb-1">
                                {isDrawer ? "Draw this word" : "Guess the word"}
                            </span>
                            <motion.div
                                key={currentWord}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-bold tracking-[0.2em] font-mono text-white"
                            >
                                {isDrawer ? (
                                    currentWord
                                ) : (
                                    currentWord.split('').map(c => c === ' ' ? ' ' : '_').join(' ')
                                )}
                            </motion.div>
                        </div>

                        <div className="text-right">
                            <span className="text-sm text-slate-400 font-display tracking-widest uppercase block">Round</span>
                            <span className="text-2xl font-bold text-purple-400">1/3</span>
                        </div>
                    </div>

                    {/* Drawing Canvas */}
                    <div className="flex-1 min-h-[400px]">
                        <DrawingCanvas isDrawer={isDrawer} />
                    </div>

                    {/* Mobile Players Strip */}
                    <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
                        {players.map((player, idx) => (
                            <div key={player.userName} className="w-48 shrink-0">
                                <PlayerCard player={player} isCurrentDrawer={idx === currentDrawerIndex} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Chat */}
                <div className="lg:col-span-1 h-[400px] lg:h-auto">
                    <ChatPanel />
                </div>

            </div>
        </div>
    );
};

export default GamePage;
