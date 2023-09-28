package com.jshimas.karmaapi.domain.exceptions;

public class UnauthorizedAccessException extends RuntimeException{
    public UnauthorizedAccessException() {
        super("User does not have a permission to perform this action");
    }

    public UnauthorizedAccessException(String message) {
        super(message);
    }

    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, cause);
    }

    public UnauthorizedAccessException(Throwable cause) {
        super(cause);
    }

    protected UnauthorizedAccessException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
