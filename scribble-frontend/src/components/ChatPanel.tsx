import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { wsService } from '../services/websocket';

const ChatPanel: React.FC = () => {
    const { chatMessages, currentUser, gameState } = useGame();
    const [guess, setGuess] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isDrawer = gameState?.players[gameState?.currentDrawerIndex]?.userName === currentUser?.userName;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guess.trim() || !currentUser || isDrawer) return;

        wsService.sendGuess(currentUser.userName, guess.trim());
        setGuess('');
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
            <div className="bg-slate-800 border-b border-slate-700 py-3 px-4 shadow-sm">
                <h3 className="font-display font-bold text-white tracking-widest text-sm uppercase">Chat & Guesses</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center italic mt-10">Start guessing the word!</p>
                ) : (
                    chatMessages.map((msg, index) => {
                        const isCorrect = msg.type === 'correct';
                        const isSystem = msg.type === 'system';

                        return (
                            <div
                                key={index}
                                className={`p-2 rounded-lg text-sm
                  ${isCorrect ? 'bg-green-900/30 text-green-400 border border-green-500/30 font-bold'
                                        : isSystem ? 'bg-cyan-900/20 text-cyan-400 text-center italic border border-cyan-500/20'
                                            : 'bg-slate-800 text-slate-200'}`}
                            >
                                {!isSystem && (
                                    <span className={`font-bold mr-2 ${msg.userName === currentUser?.userName ? 'text-purple-400' : 'text-slate-400'}`}>
                                        {msg.userName}:
                                    </span>
                                )}
                                <span className="break-words">{msg.message}</span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-slate-700 bg-slate-800/80">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        disabled={isDrawer}
                        placeholder={isDrawer ? "You are drawing!" : "Type your guess..."}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={isDrawer || !guess.trim()}
                        className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-cyan-600 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPanel;
