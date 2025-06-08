package com.photolax.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User login request")
public class LoginRequestDTO {

    @Schema(description = "Username or email", example = "johndoe", required = true)
    @NotBlank(message = "Username or email cannot be blank")
    private String usernameOrEmail;

    @Schema(description = "Password", example = "password123", required = true)
    @NotBlank(message = "Password cannot be blank")
    private String password;
} 