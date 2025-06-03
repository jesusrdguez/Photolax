package com.photolax.controller;

import com.photolax.dto.PhotoCardDTO;
import com.photolax.dto.PhotoUploadRequestDTO;
import com.photolax.dto.UpdatePhotoStatusRequestDTO;
import com.photolax.dto.PhotoDisplayDTO;
import com.photolax.model.PhotoStatus;
import com.photolax.model.Role;
import com.photolax.service.PhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api-photolax/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PhotoCardDTO> uploadPhoto(
            @Valid @RequestPart("photoDetails") PhotoUploadRequestDTO requestDTO,
            @RequestPart("file") MultipartFile file
    ) {
        PhotoCardDTO uploadedPhoto = photoService.uploadPhoto(requestDTO, file);
        return new ResponseEntity<>(uploadedPhoto, HttpStatus.CREATED);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PhotoCardDTO>> getPhotoFeed() {
        return ResponseEntity.ok(photoService.getPhotoFeed());
    }

    @GetMapping
    public ResponseEntity<List<PhotoDisplayDTO>> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoCardDTO> getPhotoById(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.getPhotoById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PhotoCardDTO>> getPhotosByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(photoService.getPhotosByUserId(userId));
    }

    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<PhotoCardDTO>> getPhotosByContestId(@PathVariable Long contestId) {
        return ResponseEntity.ok(photoService.getPhotosByContestId(contestId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PhotoCardDTO>> getPhotosByStatus(@PathVariable PhotoStatus status) {
        return ResponseEntity.ok(photoService.getPhotosByStatus(status));
    }

    @GetMapping("/user/{userId}/contest/{contestId}")
    public ResponseEntity<List<PhotoCardDTO>> getPhotosByUserAndContest(
            @PathVariable Long userId, 
            @PathVariable Long contestId
    ) {
        return ResponseEntity.ok(photoService.getPhotosByUserAndContest(userId, contestId));
    }

    @GetMapping("/contest/{contestId}/status/{status}")
    public ResponseEntity<List<PhotoDisplayDTO>> getPhotosByContestAndStatusWithDisplay(
            @PathVariable Long contestId, 
            @PathVariable PhotoStatus status
    ) {
        return ResponseEntity.ok(photoService.getPhotosByContestAndStatusForDisplay(contestId, status));
    }

    @PutMapping("/{photoId}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PhotoCardDTO> updatePhotoStatus(
            @PathVariable Long photoId, 
            @Valid @RequestBody UpdatePhotoStatusRequestDTO requestDTO
    ) {
        return ResponseEntity.ok(photoService.updatePhotoStatus(photoId, requestDTO));
    }

    @DeleteMapping("/{photoId}")
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<Void> deletePhoto(@PathVariable Long photoId) {
        photoService.deletePhoto(photoId);
        return ResponseEntity.noContent().build();
    }
} 