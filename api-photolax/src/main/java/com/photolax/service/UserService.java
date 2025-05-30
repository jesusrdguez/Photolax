package com.photolax.service;

import com.photolax.dto.UserDTO; // Para creación/actualización por admin
import com.photolax.dto.UserResponseDTO;
import com.photolax.dto.UserUpdateDTO; // Para actualización de perfil por el propio usuario
import com.photolax.model.User;
import com.photolax.model.Role;
import com.photolax.repository.UserRepository;
import com.photolax.error.UserNotFoundByEmailException;
import com.photolax.error.UserNotFoundByIdException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private UserResponseDTO convertToUserResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .registrationDate(user.getRegistrationDate())
                .role(user.getRole())
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToUserResponseDTO)
                .orElseThrow(() -> new UserNotFoundByIdException(id));
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToUserResponseDTO)
                .orElseThrow(() -> new UserNotFoundByEmailException(email));
    }
    
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundByEmailException(username));
    }

    @Transactional
    public UserResponseDTO createUser(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + userDTO.getUsername());
        }
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + userDTO.getEmail());
        }

        User user = User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .role(userDTO.getRole() != null ? userDTO.getRole() : Role.USER)
                .build();
        User savedUser = userRepository.save(user);
        return convertToUserResponseDTO(savedUser);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserUpdateDTO userUpdateDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundByIdException(id));

        if (userUpdateDTO.getFirstName() != null) {
            user.setFirstName(userUpdateDTO.getFirstName());
        }
        if (userUpdateDTO.getLastName() != null) {
            user.setLastName(userUpdateDTO.getLastName());
        }
        if (userUpdateDTO.getEmail() != null && !userUpdateDTO.getEmail().equals(user.getEmail())) {
            if(userRepository.findByEmail(userUpdateDTO.getEmail()).filter(existingUser -> !existingUser.getId().equals(id)).isPresent()){
                throw new IllegalArgumentException("Email already in use: " + userUpdateDTO.getEmail());
            }
            user.setEmail(userUpdateDTO.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return convertToUserResponseDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundByIdException(id);
        }
        userRepository.deleteById(id);
    }

    public User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundByEmailException("Authenticated user not found: " + username)); // O UserNotFoundByUsername
    }
} 