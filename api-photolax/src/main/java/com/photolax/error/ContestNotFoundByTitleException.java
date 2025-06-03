package com.photolax.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ContestNotFoundByTitleException extends RuntimeException {
    public ContestNotFoundByTitleException(String title) {
        super("Could not find contest with title: " + title);
    }
}
