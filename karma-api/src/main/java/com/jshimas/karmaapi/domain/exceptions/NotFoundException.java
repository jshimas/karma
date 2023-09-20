package com.jshimas.karmaapi.domain.exceptions;

import java.util.UUID;

public class NotFoundException extends RuntimeException {
    public NotFoundException() {
        super();
    }

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(Class<?> clazz, UUID id) {
        super(String.format("%s with id %s not found", clazz.getSimpleName(), id.toString()));
    }

    public NotFoundException(Class<?> clazz, String id) {
        super(String.format("%s with id %s not found", clazz.getSimpleName(), id));
    }
}
