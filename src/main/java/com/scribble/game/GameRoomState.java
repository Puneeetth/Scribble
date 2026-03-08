package com.scribble.game;

import com.scribble.model.RoomPlayer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameRoomState {
    private String roomCode;
    private List<RoomPlayer> players = new ArrayList<>();
    private int currentDrawerIndex = 0;
    private String currentWord;

    private Set<Long> guessedPlayers = new HashSet<>();

    private LocalDateTime roundStartedTime;

    private boolean roundActive = false;

    public GameRoomState(String roomCode) {
    }
}
