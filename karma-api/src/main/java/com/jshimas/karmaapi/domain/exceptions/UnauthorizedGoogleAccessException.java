package com.jshimas.karmaapi.domain.exceptions;

public class UnauthorizedGoogleAccessException extends RuntimeException {
    public UnauthorizedGoogleAccessException() {
        super("Failed to generate Google access token");
    }
}
