export interface Player {
    userName: string;
    score: number;
    isHost: boolean;
}

export interface Room {
    roomCode: string;
    status: 'WAITING' | 'PLAYING' | 'FINISHED';
    players: Player[];
}

export interface CreateRoomRequest {
    userName: string;
}

export interface JoinRoomRequest {
    roomCode: string;
    userName: string;
}

export interface RoomResponse {
    roomCode: string;
    status: string;
    players: Player[];
}

export interface GameState {
    roomCode: string;
    players: Player[];
    currentDrawerIndex: number;
    currentWord: string;
    guessedPlayers: number[]; // Set of player IDs or usernames
    roundActive: boolean;
    timeLeft?: number;
}

export interface ChatMessage {
    id: string;
    userName?: string;
    message: string;
    type: 'system' | 'guess' | 'correct';
}

export interface DrawingData {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    color: string;
    size: number;
    clear?: boolean;
}
