package com.scribble.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String userName) {

        super("User with name : " + userName + " already exists");
    }
}
