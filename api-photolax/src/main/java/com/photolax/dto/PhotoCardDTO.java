package com.photolax.dto;

import com.photolax.model.PhotoStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Photo card information for display in lists and feeds")
public class PhotoCardDTO {
    
    @Schema(description = "Photo ID", example = "1")
    private Long id;

    @Schema(description = "Photo title", example = "Sunset at the beach")
    private String title;

    @Schema(description = "User who uploaded the photo")
    private UserResponseDTO user;

    @Schema(description = "ID of the contest this photo belongs to", example = "1")
    private Long contestId;

    @Schema(description = "Title of the contest this photo belongs to", example = "Summer Photography Contest")
    private String contestTitle;

    @Schema(description = "Current status of the photo", example = "APPROVED")
    private PhotoStatus status;

    @Schema(description = "Date and time when the photo was uploaded", example = "2024-03-20T15:30:00")
    private LocalDateTime uploadDate;

    @Schema(description = "Number of votes received", example = "42")
    private Integer voteCount;
} 