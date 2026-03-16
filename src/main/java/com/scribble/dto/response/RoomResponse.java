package com.scribble.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class RoomResponse {
    private String roomCode;
    private String status;

    private List<PlayerResponse> players;
}
