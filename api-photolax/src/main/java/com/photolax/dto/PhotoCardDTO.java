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
    private UserResponseDTO user; // Información básica del usuario que subió la foto
    private Long contestId;
    private String contestTitle; // Podría ser útil tener el título del concurso
    private PhotoStatus status;
    private LocalDateTime uploadDate;
    private Integer voteCount;
    // private String imageUrl; // Opcional: si tienes un endpoint para servir la imagen
} 