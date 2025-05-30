package com.photolax.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class VoteException extends RuntimeException {
    public VoteException(String message) {
        super(message);
    }
} 