package com.photolax.controller;

import com.photolax.dto.ContestDTO;
import com.photolax.dto.PutContestDTO;
import com.photolax.model.Role;
import com.photolax.service.ContestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api-photolax/contests") // El prefijo /api-photolax/ ya no es necesario aquí si se configura globalmente o se prefiere así
@RequiredArgsConstructor
public class ContestController {

    private final ContestService contestService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ContestDTO> createContest(@Valid @RequestBody ContestDTO contestDTO) {
        ContestDTO createdContest = contestService.createContest(contestDTO);
        return new ResponseEntity<>(createdContest, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ContestDTO>> getAllContests() {
        List<ContestDTO> contests = contestService.getAllContests();
        return ResponseEntity.ok(contests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContestDTO> getContestById(@PathVariable Long id) {
        ContestDTO contest = contestService.getContestById(id);
        return ResponseEntity.ok(contest);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ContestDTO> updateContest(@PathVariable Long id, @Valid @RequestBody PutContestDTO putContestDTO) {
        ContestDTO updatedContest = contestService.updateContest(id, putContestDTO);
        return ResponseEntity.ok(updatedContest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteContest(@PathVariable Long id) {
        contestService.deleteContest(id);
        return ResponseEntity.noContent().build();
    }
} 