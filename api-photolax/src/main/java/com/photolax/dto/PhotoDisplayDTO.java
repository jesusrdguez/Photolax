package com.photolax.dto;

import com.photolax.model.PhotoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDisplayDTO {
    private Long id; // Photo ID
    private String title;
    private String username; // Username of the uploader
    private String photoBase64; // Image data as Base64 string
    private PhotoStatus status; // To confirm the status context
    private Integer voteCount; // <--- AÑADIR ESTA LÍNEA
    // private Long contestId; // Optional: if needed for context
    // private String contestTitle; // Optional: if needed for context
} 