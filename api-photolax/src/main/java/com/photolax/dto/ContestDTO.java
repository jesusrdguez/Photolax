package com.photolax.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContestDTO {
    private Long id;

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @Pattern(regexp = "^\\d{2}/\\d{2}/\\d{4}$", message = "Start date must be in format dd/MM/yyyy")
    private String startDate;

    @Pattern(regexp = "^\\d{2}/\\d{2}/\\d{4}$", message = "End date must be in format dd/MM/yyyy")
    private String endDate;

    @PositiveOrZero(message = "Max participants must be zero or positive")
    private Integer maxParticipants;
} 