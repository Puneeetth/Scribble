package com.scribble.exception;

public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(String roomCode) {

        super("Room with code : " + roomCode + " not found");
    }
}
