import { CreateRoomRequest, JoinRoomRequest, RoomResponse } from '../types';

const API_BASE_URL = '/api';

/**
 * Service for interacting with the Scribble REST API.
 * Currently using mock data since the backend controllers are stubs.
 */
export const api = {
    createRoom: async (req: CreateRoomRequest): Promise<RoomResponse> => {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${API_BASE_URL}/rooms/create`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(req),
        // });
        // if (!response.ok) throw new Error('Failed to create room');
        // return response.json();

        // Mock implementation
        return new Promise((resolve) => setTimeout(() => {
            resolve({
                roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                status: 'WAITING',
                players: [{ userName: req.userName, score: 0, isHost: true }]
            });
        }, 500));
    },

    joinRoom: async (req: JoinRoomRequest): Promise<RoomResponse> => {
        // TODO: Replace with actual API call when backend is ready
        // const response = await fetch(`${API_BASE_URL}/rooms/join`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(req),
        // });
        // if (!response.ok) throw new Error('Failed to join room');
        // return response.json();

        // Mock implementation
        return new Promise((resolve, reject) => setTimeout(() => {
            if (req.roomCode.length !== 6) {
                reject(new Error('Invalid room code'));
                return;
            }
            resolve({
                roomCode: req.roomCode.toUpperCase(),
                status: 'WAITING',
                players: [
                    { userName: 'HostPlayer', score: 0, isHost: true },
                    { userName: req.userName, score: 0, isHost: false }
                ]
            });
        }, 500));
    },

    getRoom: async (roomCode: string): Promise<RoomResponse> => {
        // TODO: Replace with actual API call when backend is ready
        return new Promise((resolve) => setTimeout(() => {
            resolve({
                roomCode: roomCode.toUpperCase(),
                status: 'WAITING',
                players: [
                    { userName: 'HostPlayer', score: 0, isHost: true }
                ]
            });
        }, 500));
    }
};
