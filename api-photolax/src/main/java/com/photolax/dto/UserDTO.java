package com.photolax.dto;

import com.photolax.model.Role;
import jakarta.validation.constraints.Email;
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
public class UserDTO {

    private Long id; // Podría ser útil para respuestas o actualizaciones

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Size(max = 50, message = "Email must be less than 50 characters")
    private String email;

    // La contraseña puede ser opcional aquí si es para mostrar datos o si la creación la maneja RegisterRequestDTO
    // Si es para creación por admin, debería estar y ser NotBlank.
    // Por ahora, la incluiré como opcional para flexibilidad.
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password; // Hacer NotBlank si es para creación obligatoria

    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must be less than 100 characters")
    private String lastName;

    @NotNull(message = "Role cannot be null")
    private Role role;
} 