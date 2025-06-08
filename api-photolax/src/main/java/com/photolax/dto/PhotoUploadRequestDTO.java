package com.photolax.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Photo upload request")
public class PhotoUploadRequestDTO {

    @Schema(description = "Photo title", example = "Sunset at the beach", required = true)
    @NotBlank(message = "Title cannot be blank")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @Schema(description = "ID of the contest this photo is being submitted to", example = "1", required = true)
    @NotNull(message = "Contest ID cannot be null")
    private Long contestId;
} 