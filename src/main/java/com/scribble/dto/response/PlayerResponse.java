package com.scribble.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PlayerResponse {
    private String userName;
    private Integer score;
    private Boolean isHost;


}
