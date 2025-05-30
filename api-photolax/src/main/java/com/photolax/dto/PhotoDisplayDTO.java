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
    private Long id;
    private String title;
    private String username;
    private String photoBase64;
    private PhotoStatus status;
    private Integer voteCount;
} 