import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, Room, GameState, ChatMessage, DrawingData } from '../types';
import { wsService } from '../services/websocket';

interface GameContextType {
    currentUser: Player | null;
    setCurrentUser: (user: Player | null) => void;
    room: Room | null;
    setRoom: (room: Room | null) => void;
    gameState: GameState | null;
    setGameState: (state: GameState | null) => void;
    chatMessages: ChatMessage[];
    addChatMessage: (msg: ChatMessage) => void;
    clearChat: () => void;
    drawingDataQueue: DrawingData[];
    addDrawingData: (data: DrawingData) => void;
    clearDrawingDataQueue: () => void;
    connectToGame: (roomCode: string) => void;
    disconnectFromGame: () => void;
    isConnected: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<Player | null>(null);
    const [room, setRoom] = useState<Room | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [drawingDataQueue, setDrawingDataQueue] = useState<DrawingData[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const addChatMessage = (msg: ChatMessage) => {
        setChatMessages((prev) => [...prev, msg]);
    };

    const clearChat = () => setChatMessages([]);

    const addDrawingData = (data: DrawingData) => {
        setDrawingDataQueue((prev) => [...prev, data]);
    };

    const clearDrawingDataQueue = () => setDrawingDataQueue([]);

    const connectToGame = (roomCode: string) => {
        wsService.connect(
            roomCode,
            (state) => {
                setGameState(state);
            },
            (msg) => {
                addChatMessage(msg);
            },
            (data) => {
                addDrawingData(data);
            },
            () => {
                setIsConnected(true);
            }
        );
    };

    const disconnectFromGame = () => {
        wsService.disconnect();
        setIsConnected(false);
        setRoom(null);
        setGameState(null);
        clearChat();
    };

    return (
        <GameContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                room,
                setRoom,
                gameState,
                setGameState,
                chatMessages,
                addChatMessage,
                clearChat,
                drawingDataQueue,
                addDrawingData,
                clearDrawingDataQueue,
                connectToGame,
                disconnectFromGame,
                isConnected
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
