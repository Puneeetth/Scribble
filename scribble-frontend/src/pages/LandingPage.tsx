import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pencil, Users, Star } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlowButton from '../components/GlowButton';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
            <AnimatedBackground />

            <div className="z-10 w-full max-w-4xl flex flex-col items-center">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <motion.div
                        animate={{
                            textShadow: [
                                "0 0 10px #a855f7, 0 0 20px #a855f7",
                                "0 0 15px #a855f7, 0 0 30px #a855f7, 0 0 40px #06b6d4",
                                "0 0 10px #a855f7, 0 0 20px #a855f7"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl md:text-8xl font-black font-display text-white tracking-widest uppercase"
                    >
                        Scribble
                    </motion.div>
                    <p className="mt-4 text-cyan-400 font-body text-xl md:text-2xl tracking-wide opacity-80">
                        Draw, Guess, Win
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-6 mb-20 w-full md:w-auto"
                >
                    <GlowButton
                        variant="primary"
                        onClick={() => navigate('/create')}
                        className="text-lg w-full sm:w-64 py-4"
                    >
                        Create Room
                    </GlowButton>
                    <GlowButton
                        variant="secondary"
                        onClick={() => navigate('/join')}
                        className="text-lg w-full sm:w-64 py-4"
                    >
                        Join Room
                    </GlowButton>
                </motion.div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <FeatureCard
                        icon={<Pencil className="w-8 h-8 text-purple-400" />}
                        title="Real-Time Drawing"
                        description="Experience low-latency syncing powered by WebSockets."
                        delay={0.5}
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8 text-cyan-400" />}
                        title="Play With Friends"
                        description="Create private rooms and challenge your friend group."
                        delay={0.6}
                    />
                    <FeatureCard
                        icon={<Star className="w-8 h-8 text-pink-400" />}
                        title="Earn Points"
                        description="Guess fast to maximize your score and dominate."
                        delay={0.7}
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card-strong p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300"
    >
        <div className="p-4 rounded-full bg-slate-800/50 mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-display tracking-wide">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

export default LandingPage;
