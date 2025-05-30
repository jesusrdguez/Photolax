package com.photolax.controller;

import com.photolax.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api-photolax/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/photo/{photoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> castVote(@PathVariable Long photoId) {
        voteService.castVote(photoId);
        return ResponseEntity.ok().build(); 
    }
} 