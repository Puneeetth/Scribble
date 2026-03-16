package com.scribble.dto.request;

import lombok.Data;

@Data
public class JoinRoomRequest {
    private String roomCode;
    private String userName;
}
