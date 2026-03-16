package com.scribble.dto.response;

import lombok.Data;

@Data
public class PlayerResponse {
    private String userName;
    private String score;
    private Boolean isHost;
}
