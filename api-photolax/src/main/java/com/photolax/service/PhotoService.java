package com.photolax.service;

import com.photolax.dto.PhotoCardDTO;
import com.photolax.dto.PhotoDisplayDTO;
import com.photolax.dto.PhotoUploadRequestDTO;
import com.photolax.dto.UpdatePhotoStatusRequestDTO;
import com.photolax.dto.UserResponseDTO;
import com.photolax.error.ContestNotFoundException;
import com.photolax.error.PhotoNotFoundException;
import com.photolax.error.StorageException;
import com.photolax.model.*;
import com.photolax.repository.PhotoRepository;
import com.photolax.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final UserService userService;
    private final ContestService contestService;
    private final VoteRepository voteRepository;

    private PhotoCardDTO convertToPhotoCardDTO(Photo photo) {
        User userEntity = photo.getUser();
        UserResponseDTO userResponseDTO = null;
        if (userEntity != null) {
            userResponseDTO = UserResponseDTO.builder()
                    .id(userEntity.getId())
                    .username(userEntity.getUsername())
                    .build();
        }

        Contest contestEntity = photo.getContest();
        String contestTitle = null;
        if (contestEntity != null) {
            contestTitle = contestEntity.getTitle();
        }

        return PhotoCardDTO.builder()
                .id(photo.getId())
                .title(photo.getTitle())
                .user(userResponseDTO)
                .contestId(photo.getContest() != null ? photo.getContest().getId() : null)
                .contestTitle(contestTitle)
                .status(photo.getStatus())
                .uploadDate(photo.getUploadDate())
                .voteCount(photo.getVoteCount())
                .build();
    }

    private PhotoDisplayDTO convertToPhotoDisplayDTO(Photo photo) {
        String photoBase64 = null;
        if (photo.getFileData() != null) {
            photoBase64 = Base64.getEncoder().encodeToString(photo.getFileData());
        }
        return PhotoDisplayDTO.builder()
                .id(photo.getId())
                .title(photo.getTitle())
                .username(photo.getUser() != null ? photo.getUser().getUsername() : "Unknown")
                .photoBase64(photoBase64)
                .status(photo.getStatus())
                .voteCount(photo.getVoteCount())
                .build();
    }

    @Transactional
    public PhotoCardDTO uploadPhoto(PhotoUploadRequestDTO requestDTO, MultipartFile file) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Contest contest = contestService.getContestEntityById(requestDTO.getContestId());

        if (contest.getEndDate() != null && contest.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Cannot upload photo to a contest that has ended.");
        }

        long currentParticipants = photoRepository.findByContest_Id(contest.getId()).size();
        if (currentParticipants >= contest.getMaxParticipants()) {
            throw new IllegalArgumentException("Contest has reached its maximum number of participants.");
        }

        List<Photo> userPhotosInContest = photoRepository.findByUser_IdAndContest_Id(currentUser.getId(), contest.getId());
        if (!userPhotosInContest.isEmpty()) {
            throw new IllegalArgumentException("You have already submitted a photo to this contest.");
        }

        try {
            Photo photo = Photo.builder()
                    .title(requestDTO.getTitle())
                    .fileData(file.getBytes())
                    .user(currentUser)
                    .contest(contest)
                    .status(PhotoStatus.PENDING)
                    .voteCount(0)
                    .build();
            Photo savedPhoto = photoRepository.save(photo);
            return convertToPhotoCardDTO(savedPhoto);
        } catch (IOException e) {
            throw new StorageException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    @Transactional(readOnly = true)
    public PhotoCardDTO getPhotoById(Long id) {
        return photoRepository.findById(id)
                .map(this::convertToPhotoCardDTO)
                .orElseThrow(() -> new PhotoNotFoundException(id));
    }
    
    @Transactional(readOnly = true)
    public Photo getPhotoEntityById(Long id) {
        return photoRepository.findById(id)
                .orElseThrow(() -> new PhotoNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<PhotoDisplayDTO> getAllPhotos() {
        return photoRepository.findAll().stream()
                .map(this::convertToPhotoDisplayDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoCardDTO> getPhotoFeed() {
        return photoRepository.findByStatusOrderByUploadDateDesc(PhotoStatus.APPROVED).stream()
                .map(this::convertToPhotoCardDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoCardDTO> getPhotosByUserId(Long userId) {
        userService.getUserById(userId);
        return photoRepository.findByUser_Id(userId).stream()
                .map(this::convertToPhotoCardDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoCardDTO> getPhotosByContestId(Long contestId) {
        contestService.getContestEntityById(contestId);
        return photoRepository.findByContest_Id(contestId).stream()
                .map(this::convertToPhotoCardDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoCardDTO> getPhotosByStatus(PhotoStatus status) {
        return photoRepository.findByStatus(status).stream()
                .map(this::convertToPhotoCardDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoCardDTO> getPhotosByUserAndContest(Long userId, Long contestId) {
        return photoRepository.findByUser_IdAndContest_Id(userId, contestId).stream()
                .map(this::convertToPhotoCardDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoCardDTO> getPhotosByContestAndStatus(Long contestId, PhotoStatus status) {
        return photoRepository.findByContest_IdAndStatus(contestId, status).stream()
                .map(this::convertToPhotoCardDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PhotoDisplayDTO> getPhotosByContestAndStatusForDisplay(Long contestId, PhotoStatus status) {
        contestService.getContestEntityById(contestId); 
        return photoRepository.findByContest_IdAndStatus(contestId, status).stream()
                .map(this::convertToPhotoDisplayDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PhotoCardDTO updatePhotoStatus(Long photoId, UpdatePhotoStatusRequestDTO requestDTO) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new PhotoNotFoundException(photoId));
        
        photo.setStatus(requestDTO.getStatus());
        Photo updatedPhoto = photoRepository.save(photo);
        return convertToPhotoCardDTO(updatedPhoto);
    }

    @Transactional
    public void deletePhoto(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new PhotoNotFoundException(photoId));

        User currentUser = userService.getCurrentAuthenticatedUser();
        if (!photo.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to delete this photo.");
        }
        
        // Delete all votes associated with the photo first
        voteRepository.deleteByPhoto_Id(photoId);
        
        // Then delete the photo
        photoRepository.delete(photo);
    }
    
    @Transactional
    protected void incrementVoteCount(Long photoId) {
        Photo photo = getPhotoEntityById(photoId);
        photo.setVoteCount(photo.getVoteCount() + 1);
        photoRepository.save(photo);
    }

    @Transactional
    protected void decrementVoteCount(Long photoId) {
        Photo photo = getPhotoEntityById(photoId);
        if (photo.getVoteCount() > 0) {
            photo.setVoteCount(photo.getVoteCount() - 1);
            photoRepository.save(photo);
        }
    }
} 