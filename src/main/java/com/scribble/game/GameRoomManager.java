package com.scribble.game;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class GameRoomManager {
    private final Map<String, GameRoomState> gameRooms = new ConcurrentHashMap<>();

    public GameRoomState createRoom(String roomCode) {
        GameRoomState state = new GameRoomState(roomCode);
        gameRooms.put(roomCode, state);
        return state;
    }

    public GameRoomState getRoom(String roomCode) {
        return gameRooms.get(roomCode);
    }

    public boolean roomExists(String roomCode) {
        return gameRooms.containsKey(roomCode);
    }

    public void removeRoom(String roomCode) {
        gameRooms.remove(roomCode);
    }
    public void removeRemovedRooms(){
        gameRooms.entrySet().removeIf(entry -> entry.getValue().getPlayers().isEmpty());
    }
}
