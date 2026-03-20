import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage, DrawingData, GameState } from '../types';

class WebSocketService {
    private client: Client | null = null;
    private roomCode: string | null = null;

    // Callbacks
    private onGameStateUpdate?: (state: GameState) => void;
    private onChatReceived?: (msg: ChatMessage) => void;
    private onDrawingReceived?: (data: DrawingData) => void;

    public connect(
        roomCode: string,
        onGameState: (state: GameState) => void,
        onChat: (msg: ChatMessage) => void,
        onDrawing: (data: DrawingData) => void,
        onConnect?: () => void
    ) {
        this.roomCode = roomCode;
        this.onGameStateUpdate = onGameState;
        this.onChatReceived = onChat;
        this.onDrawingReceived = onDrawing;

        const socketUrl = 'http://localhost:8080/scribble';

        this.client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                this.subscribeToRoom();
                if (onConnect) onConnect();
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            debug: (str) => {
                // console.log(str);
            }
        });

        this.client.activate();
    }

    private subscribeToRoom() {
        if (!this.client || !this.roomCode) return;

        // Subscribe to game state updates
        this.client.subscribe(`/topic/game/${this.roomCode}`, (message) => {
            if (this.onGameStateUpdate) {
                this.onGameStateUpdate(JSON.parse(message.body));
            }
        });

        // Subscribe to chat/guesses
        this.client.subscribe(`/topic/chat/${this.roomCode}`, (message) => {
            if (this.onChatReceived) {
                this.onChatReceived(JSON.parse(message.body));
            }
        });

        // Subscribe to drawing events
        this.client.subscribe(`/topic/draw/${this.roomCode}`, (message) => {
            if (this.onDrawingReceived) {
                this.onDrawingReceived(JSON.parse(message.body));
            }
        });
    }

    public sendDraw(data: DrawingData) {
        if (this.client?.connected && this.roomCode) {
            this.client.publish({
                destination: `/app/game.draw/${this.roomCode}`,
                body: JSON.stringify(data),
            });
        }
    }

    public sendGuess(userName: string, guess: string) {
        if (this.client?.connected && this.roomCode) {
            this.client.publish({
                destination: `/app/game.guess/${this.roomCode}`,
                body: JSON.stringify({ userName, message: guess, type: 'guess' }),
            });
        }
    }

    public startGame() {
        if (this.client?.connected && this.roomCode) {
            this.client.publish({
                destination: `/app/game.start/${this.roomCode}`,
                body: JSON.stringify({ roomCode: this.roomCode }),
            });
        }
    }

    public disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
        this.roomCode = null;
    }
}

export const wsService = new WebSocketService();
