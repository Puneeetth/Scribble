package com.scribble.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RoomResponse {
    private String roomCode;
    private String status;

    private List<PlayerResponse> players;


}
