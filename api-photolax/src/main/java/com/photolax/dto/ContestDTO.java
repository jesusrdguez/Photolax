package com.photolax.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestDTO {
    private Long id;

    @NotBlank(message = "Title cannot be blank")
    private String title;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @PositiveOrZero(message = "Max participants must be zero or positive")
    private Integer maxParticipants;
} 