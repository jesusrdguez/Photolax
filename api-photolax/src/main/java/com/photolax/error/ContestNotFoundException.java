package com.photolax.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ContestNotFoundException extends RuntimeException {
    public ContestNotFoundException(Long id) {
        super("Could not find contest with id: " + id);
    }

    public ContestNotFoundException(String message) {
        super(message);
    }
} 