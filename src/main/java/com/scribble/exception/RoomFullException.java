package com.scribble.exception;

public class RoomFullException extends RuntimeException {
    public RoomFullException(String roomCode) {

        super("Room is full : " + roomCode);
    }
}
