package com.scribble.controller;

import com.scribble.dto.request.CreateRoomRequest;
import com.scribble.dto.request.JoinRoomRequest;
import com.scribble.dto.response.RoomResponse;
import com.scribble.service.RoomService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rooms")
@AllArgsConstructor

public class RoomController {
        private final RoomService roomService;

        @PostMapping("/create")
        public RoomResponse createRoom(@RequestBody CreateRoomRequest request){
            return roomService.createRoom(request);
        }

        @PostMapping("/join")
    public RoomResponse joinRoom(@RequestBody JoinRoomRequest request){
            return roomService.joinRoom(request);
        }
}
