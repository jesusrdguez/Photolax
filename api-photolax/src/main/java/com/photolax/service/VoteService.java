package com.photolax.service;

import com.photolax.error.PhotoNotFoundException;
import com.photolax.error.VoteException;
import com.photolax.model.Photo;
import com.photolax.model.PhotoStatus;
import com.photolax.model.User;
import com.photolax.model.Vote;
import com.photolax.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final UserService userService;
    private final PhotoService photoService; // Usaremos el método protegido para incrementar/decrementar votos

    @Transactional
    public void castVote(Long photoId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Photo photo = photoService.getPhotoEntityById(photoId);

        // Validaciones:
        // 1. La foto debe estar APROBADA para ser votada
        if (photo.getStatus() != PhotoStatus.APPROVED) {
            throw new VoteException("Photo is not approved for voting. Current status: " + photo.getStatus());
        }

        // 2. El usuario no puede votar por su propia foto
        if (photo.getUser().getId().equals(currentUser.getId())) {
            throw new VoteException("Users cannot vote for their own photos.");
        }

        // 3. El usuario solo puede votar una vez por foto
        if (voteRepository.findByUser_IdAndPhoto_Id(currentUser.getId(), photoId).isPresent()) {
            throw new VoteException("User has already voted for this photo.");
        }

        // 4. El usuario puede votar un máximo de tres fotografías por concurso
        if (photo.getContest() != null) { // Solo aplica si la foto pertenece a un concurso
            long votesInContest = voteRepository.countByUser_IdAndPhoto_Contest_Id(currentUser.getId(), photo.getContest().getId());
            if (votesInContest >= 3) {
                throw new VoteException("User has already cast 3 votes in this contest (ID: " + photo.getContest().getId() + "). Maximum votes reached.");
            }
        }
        
        // 5. (Opcional) El concurso al que pertenece la foto debe estar activo para votar
        if (photo.getContest() != null && photo.getContest().getEndDate() != null && 
            photo.getContest().getEndDate().isBefore(LocalDateTime.now())) {
            throw new VoteException("Cannot vote for a photo in a contest that has ended.");
        }
        if (photo.getContest() != null && photo.getContest().getStartDate() != null && 
            photo.getContest().getStartDate().isAfter(LocalDateTime.now())) {
            throw new VoteException("Cannot vote for a photo in a contest that has not started yet.");
        }

        Vote vote = Vote.builder()
                .user(currentUser)
                .photo(photo)
                .build();
        // El @PrePersist en Vote se encargará de voteDate
        voteRepository.save(vote);

        // Incrementar el contador de votos en la foto
        photoService.incrementVoteCount(photoId);
    }

    // Opcional: Método para retirar un voto (si la lógica de negocio lo permite)
    /*
    @Transactional
    public void retractVote(Long photoId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Photo photo = photoService.getPhotoEntityById(photoId);

        Vote vote = voteRepository.findByUser_IdAndPhoto_Id(currentUser.getId(), photoId)
                .orElseThrow(() -> new VoteException("Vote not found for this user and photo."));
        
        // (Opcional) Validar si el concurso aún permite cambios de voto
        if (photo.getContest() != null && photo.getContest().getEndDate() != null && 
            photo.getContest().getEndDate().isBefore(LocalDateTime.now())) {
            throw new VoteException("Cannot retract vote for a photo in a contest that has ended.");
        }

        voteRepository.delete(vote);
        photoService.decrementVoteCount(photoId);
    }
    */

    @Transactional(readOnly = true)
    public long getVoteCountForPhoto(Long photoId) {
        // Asegurarse de que la foto existe
        photoService.getPhotoEntityById(photoId);
        return voteRepository.countByPhoto_Id(photoId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserVotedForPhoto(Long userId, Long photoId) {
        return voteRepository.findByUser_IdAndPhoto_Id(userId, photoId).isPresent();
    }
} 