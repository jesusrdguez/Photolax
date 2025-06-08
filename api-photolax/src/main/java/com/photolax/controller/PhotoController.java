package com.photolax.controller;

import com.photolax.dto.PhotoCardDTO;
import com.photolax.dto.PhotoUploadRequestDTO;
import com.photolax.dto.UpdatePhotoStatusRequestDTO;
import com.photolax.dto.PhotoDisplayDTO;
import com.photolax.model.PhotoStatus;
import com.photolax.model.Role;
import com.photolax.service.PhotoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@Tag(name = "Photos", description = "Photo management APIs")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @Operation(summary = "Upload a new photo", description = "Uploads a new photo with details and file")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Photo uploaded successfully",
            content = @Content(schema = @Schema(implementation = PhotoCardDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized"),
        @ApiResponse(responseCode = "413", description = "File too large")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PhotoCardDTO> uploadPhoto(
            @Valid @RequestPart("photoDetails") PhotoUploadRequestDTO requestDTO,
            @RequestPart("file") MultipartFile file
    ) {
        PhotoCardDTO uploadedPhoto = photoService.uploadPhoto(requestDTO, file);
        return new ResponseEntity<>(uploadedPhoto, HttpStatus.CREATED);
    }

    @Operation(summary = "Get photo feed", description = "Retrieves the photo feed for the current user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Photo feed retrieved successfully",
            content = @Content(schema = @Schema(implementation = PhotoCardDTO.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping("/feed")
    public ResponseEntity<List<PhotoCardDTO>> getPhotoFeed() {
        return ResponseEntity.ok(photoService.getPhotoFeed());
    }

    @Operation(summary = "Get all photos", description = "Retrieves all photos in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Photos retrieved successfully",
            content = @Content(schema = @Schema(implementation = PhotoDisplayDTO.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @GetMapping
    public ResponseEntity<List<PhotoDisplayDTO>> getAllPhotos() {
        return ResponseEntity.ok(photoService.getAllPhotos());
    }

    @Operation(summary = "Get photo by ID", description = "Retrieves a specific photo by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Photo retrieved successfully",
            content = @Content(schema = @Schema(implementation = PhotoCardDTO.class))),
        @ApiResponse(responseCode = "404", description = "Photo not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PhotoCardDTO> getPhotoById(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.getPhotoById(id));
    }

    @Operation(summary = "Get photos by user ID", description = "Retrieves all photos uploaded by a specific user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Photos retrieved successfully",
            content = @Content(schema = @Schema(implementation = PhotoCardDTO.class))),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PhotoCardDTO>> getPhotosByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(photoService.getPhotosByUserId(userId));
    }

    @Operation(summary = "Get photos by contest ID", description = "Retrieves all photos submitted to a specific contest")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Photos retrieved successfully",
            content = @Content(schema = @Schema(implementation = PhotoCardDTO.class))),
        @ApiResponse(responseCode = "404", description = "Contest not found")
    })
    @GetMapping("/contest/{contestId}")
    public ResponseEntity<List<PhotoCardDTO>> getPhotosByContestId(@PathVariable Long contestId) {
        return ResponseEntity.ok(photoService.getPhotosByContestId(contestId));
    }

    @Operation(summary = "Get photos by status", description = "Retrieves all photos with a specific status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Photos retrieved successfully",
            content = @Content(schema = @Schema(implementation = PhotoCardDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid status")
    })
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