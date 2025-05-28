package com.photolax.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {

    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must be less than 100 characters")
    private String lastName;

    // Opcional: permitir cambio de email, requeriría validación de unicidad en el servicio
    @Email(message = "Email should be valid")
    @Size(max = 50, message = "Email must be less than 50 characters")
    private String email;

    // Opcional: permitir cambio de contraseña, requeriría manejo especial (contraseña actual, etc.)
    // @Size(min = 6, max = 100, message = "New password must be between 6 and 100 characters")
    // private String newPassword;
} 