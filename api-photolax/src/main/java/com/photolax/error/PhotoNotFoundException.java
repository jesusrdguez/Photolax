package com.photolax.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PhotoNotFoundException extends RuntimeException {
    public PhotoNotFoundException(Long id) {
        super("Could not find photo with id: " + id);
    }

    public PhotoNotFoundException(String message) {
        super(message);
    }
} 