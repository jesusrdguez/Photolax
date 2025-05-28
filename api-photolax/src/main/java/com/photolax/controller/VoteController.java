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
    @PreAuthorize("isAuthenticated()") // Solo usuarios autenticados pueden votar
    public ResponseEntity<Void> castVote(@PathVariable Long photoId) {
        voteService.castVote(photoId);
        // Considerar devolver algo más, como el nuevo conteo de votos o el objeto foto actualizado.
        // Por ahora, un 200 OK simple si el voto es exitoso (o se lanzará excepción si falla).
        return ResponseEntity.ok().build(); 
    }
    
    // Aquí se podrían añadir otros endpoints relacionados con votos si fueran necesarios,
    // como GET para ver si un usuario ha votado por una foto, o GET para el conteo de votos de una foto
    // (aunque esto último ya está en PhotoCardDTO).
} 