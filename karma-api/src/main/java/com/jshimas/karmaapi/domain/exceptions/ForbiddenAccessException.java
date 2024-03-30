package com.jshimas.karmaapi.domain.exceptions;

public class ForbiddenAccessException extends RuntimeException{
    public ForbiddenAccessException() {
        super("User does not have a permission to perform this action");
    }

    public ForbiddenAccessException(String message) {
        super(message);
    }
}
