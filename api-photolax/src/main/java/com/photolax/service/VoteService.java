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
    private final PhotoService photoService;

    @Transactional
    public void castVote(Long photoId) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Photo photo = photoService.getPhotoEntityById(photoId);

        if (photo.getStatus() != PhotoStatus.APPROVED) {
            throw new VoteException("Photo is not approved for voting. Current status: " + photo.getStatus());
        }

        if (photo.getUser().getId().equals(currentUser.getId())) {
            throw new VoteException("Users cannot vote for their own photos.");
        }

        if (voteRepository.findByUser_IdAndPhoto_Id(currentUser.getId(), photoId).isPresent()) {
            throw new VoteException("User has already voted for this photo.");
        }

        if (photo.getContest() != null) {
            long votesInContest = voteRepository.countByUser_IdAndPhoto_Contest_Id(currentUser.getId(), photo.getContest().getId());
            if (votesInContest >= 3) {
                throw new VoteException("User has already cast 3 votes in this contest (ID: " + photo.getContest().getId() + "). Maximum votes reached.");
            }
        }
        
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
        voteRepository.save(vote);

        photoService.incrementVoteCount(photoId);
    }

    @Transactional(readOnly = true)
    public long getVoteCountForPhoto(Long photoId) {
        photoService.getPhotoEntityById(photoId);
        return voteRepository.countByPhoto_Id(photoId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserVotedForPhoto(Long userId, Long photoId) {
        return voteRepository.findByUser_IdAndPhoto_Id(userId, photoId).isPresent();
    }
} 