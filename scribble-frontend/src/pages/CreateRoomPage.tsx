import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlowButton from '../components/GlowButton';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

const CreateRoomPage: React.FC = () => {
    const navigate = useNavigate();
    const { setCurrentUser, setRoom } = useGame();

    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) {
            setError('Please enter a username');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const roomResponse = await api.createRoom({ userName });

            setCurrentUser({
                userName,
                score: 0,
                isHost: true
            });
            setRoom({
                roomCode: roomResponse.roomCode,
                status: 'WAITING',
                players: roomResponse.players
            });

            navigate(`/lobby/${roomResponse.roomCode}`);
        } catch (err: any) {
            setError(err?.message || 'Failed to create room. Please try again.');
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
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />

                    <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">Create Room</h1>
                    <p className="text-slate-400 text-center mb-8 text-sm">Host a new game and invite your friends</p>

                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-purple-300 mb-2 font-display tracking-widest uppercase">
                                Your Username
                            </label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                maxLength={15}
                                className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                placeholder="Enter your hero name..."
                            />
                            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>

                        <GlowButton
                            type="submit"
                            className="w-full flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Game'
                            )}
                        </GlowButton>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateRoomPage;
