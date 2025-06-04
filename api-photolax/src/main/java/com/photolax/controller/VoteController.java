package com.photolax.controller;

import com.photolax.dto.VoteDTO;
import com.photolax.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VoteDTO>> getUserVotes() {
        return ResponseEntity.ok(voteService.getUserVotes());
    }
} 