package com.photolax.dto;

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
public class PhotoUploadRequestDTO {

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @NotNull(message = "Contest ID cannot be null")
    private Long contestId;

    // El archivo en sí (MultipartFile) se manejará en el controlador, no es parte de este DTO de solicitud JSON.
    // El servicio tomará el MultipartFile y este DTO.
} 