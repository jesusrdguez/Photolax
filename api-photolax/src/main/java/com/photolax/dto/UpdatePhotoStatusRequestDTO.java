package com.photolax.dto;

import com.photolax.model.PhotoStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePhotoStatusRequestDTO {
    @NotNull(message = "Status cannot be null")
    private PhotoStatus status;
} 