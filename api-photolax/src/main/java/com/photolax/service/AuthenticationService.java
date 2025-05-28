package com.photolax.service;

import com.photolax.dto.AuthResponseDTO;
import com.photolax.dto.LoginRequestDTO;
import com.photolax.dto.RegisterRequestDTO;
import com.photolax.dto.UserResponseDTO;
import com.photolax.model.Role;
import com.photolax.model.User;
import com.photolax.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    // private final UserService userService; // Para mapeo a UserResponseDTO

    public AuthResponseDTO register(RegisterRequestDTO request) {
        // Check if user already exists by username or email
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER) // Por defecto USER al registrarse
                .build();
        userRepository.save(user);
        
        // Crear UserResponseDTO (necesitaremos un mapper o hacerlo manualmente)
        UserResponseDTO userResponse = UserResponseDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .registrationDate(user.getRegistrationDate())
            .role(user.getRole())
            .build();

        var jwtToken = jwtService.generateToken(user);
        return AuthResponseDTO.builder()
                .token(jwtToken)
                .user(userResponse)
                .build();
    }

    public AuthResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsernameOrEmail(), // Usaremos username para la autenticación principal con UserDetailsService
                request.getPassword()
            )
        );
        // Si la autenticación es exitosa, buscamos al usuario para generar el token
        // UserDetailsService (implementado en ApplicationConfig) debería poder buscar por username o email.
        // Aquí asumimos que el AuthenticationManager valida y UserDetailsService carga el UserDetails correcto.
        var user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + request.getUsernameOrEmail())));

        // Crear UserResponseDTO
        UserResponseDTO userResponse = UserResponseDTO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .registrationDate(user.getRegistrationDate())
            .role(user.getRole())
            .build();

        var jwtToken = jwtService.generateToken(user);
        return AuthResponseDTO.builder()
                .token(jwtToken)
                .user(userResponse)
                .build();
    }
} 