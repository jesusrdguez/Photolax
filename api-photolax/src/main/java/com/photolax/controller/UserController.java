package com.photolax.controller;

import com.photolax.dto.UserDTO;
import com.photolax.dto.UserResponseDTO;
import com.photolax.dto.UserUpdateDTO;
import com.photolax.model.Role;
import com.photolax.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//RequestMapping base para la mayoría de los endpoints de usuario
@RequestMapping("/api-photolax/users") 
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // GET /users/{id}
    @GetMapping("/{id}")
    // Permitir al usuario obtener su propia información o a un ADMIN obtener la de cualquiera.
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #id == principal.id)") 
    // Nota: principal.id asume que tu UserDetails (nuestra entidad User) tiene un campo 'id'.
    // Spring Security puede acceder a campos del objeto UserDetails (principal) en expresiones SpEL.
    // Si 'principal.id' no funciona directamente, necesitaríamos un método en User (UserDetails) como getUserId() y usar principal.getUserId()
    // O buscar el usuario por username (principal.username) y luego comparar IDs.
    // Por simplicidad, asumo que User implementa un getId() accesible por SpEL o que principal.id es directamente el Long ID.
    // Si User (que implementa UserDetails) tiene el campo 'id' (Long), principal.id debería funcionar. Vamos a verificar User.java.
    // Sí, User.java tiene 'private Long id;' y Lombok @Data genera getters, por lo que 'principal.id' debería funcionar si el principal es nuestra entidad User.
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // POST /user (ruta singular como en tu Postman)
    @PostMapping("/user") // Ruta específica para POST, fuera del /users base si es necesario
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        UserResponseDTO createdUser = userService.createUser(userDTO);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // PUT /users/{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #id == principal.id)")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        UserResponseDTO updatedUser = userService.updateUser(id, userUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE /users/{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('USER') and #id == principal.id)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
} 