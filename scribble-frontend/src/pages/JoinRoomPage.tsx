import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlowButton from '../components/GlowButton';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

const JoinRoomPage: React.FC = () => {
    const navigate = useNavigate();
    const { setCurrentUser, setRoom } = useGame();

    const [userName, setUserName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) {
            setError('Please enter a username');
            return;
        }
        if (!roomCode.trim() || roomCode.length < 6) {
            setError('Please enter a valid 6-character room code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const roomResponse = await api.joinRoom({
                userName,
                roomCode: roomCode.toUpperCase()
            });

            setCurrentUser({
                userName,
                score: 0,
                isHost: false
            });
            setRoom({
                roomCode: roomResponse.roomCode,
                status: 'WAITING',
                players: roomResponse.players
            });

            navigate(`/lobby/${roomResponse.roomCode}`);
        } catch (err: any) {
            setError(err?.message || 'Failed to join room. Please check the code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="z-10 w-full max-w-md"
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-400 hover:text-white mb-6 group transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <div className="glass-card-strong p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />

                    <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">Join Room</h1>
                    <p className="text-slate-400 text-center mb-8 text-sm">Enter the code to join your friends</p>

                    <form onSubmit={handleJoin} className="space-y-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-cyan-300 mb-2 font-display tracking-widest uppercase">
                                Your Username
                            </label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                maxLength={15}
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                placeholder="Enter your hero name..."
                            />
                        </div>

                        <div>
                            <label htmlFor="roomCode" className="block text-sm font-medium text-cyan-300 mb-2 font-display tracking-widest uppercase">
                                Room Code
                            </label>
                            <input
                                type="text"
                                id="roomCode"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-center text-xl tracking-widest uppercase focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                placeholder="XXXXXX"
                            />
                            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>

                        <GlowButton
                            type="submit"
                            variant="secondary"
                            className="w-full flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                'Join Game'
                            )}
                        </GlowButton>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default JoinRoomPage;
