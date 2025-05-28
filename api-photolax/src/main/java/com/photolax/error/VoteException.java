package com.photolax.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // 409 Conflict es adecuado para votos duplicados o inválidos
public class VoteException extends RuntimeException {
    public VoteException(String message) {
        super(message);
    }
} 