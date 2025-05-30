package com.photolax.dto;

import com.photolax.model.PhotoStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhotoCardDTO {
    private Long id;
    private String title;
    private UserResponseDTO user;
    private Long contestId;
    private String contestTitle;
    private PhotoStatus status;
    private LocalDateTime uploadDate;
    private Integer voteCount;
} 