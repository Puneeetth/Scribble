package com.scribble.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PlayerController {
    @RequestMapping("/player")
    public String player(){
        return "Player";
    }
    @RequestMapping("/game")
    public String game(){
        return "Game";
    }
    @RequestMapping("/room")
    public String room(){
        return "Room";
    }
}
