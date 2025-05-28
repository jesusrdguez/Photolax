package com.photolax.config;

import com.photolax.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity // Para usar @PreAuthorize en los controladores/servicios
public class SecurityConfiguration {

    private final JWTAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider; // Viene de ApplicationConfig

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilitar CSRF para APIs stateless
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos de autenticación
                        .requestMatchers("/api-photolax/auth/**").permitAll()
                        
                        // Endpoints públicos para visualización (GET)
                        .requestMatchers(HttpMethod.GET, "/contests/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos/feed").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos").permitAll() // GET all photos
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos/{id:[0-9]+}").permitAll() // GET one photo by ID
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos/user/{userId:[0-9]+}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos/contest/{contestId:[0-9]+}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos/status/{status}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos/user/{userId:[0-9]+}/contest/{contestId:[0-9]+}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api-photolax/photos/contest/{contestId:[0-9]+}/status/{status}").permitAll()

                        // Gestión de usuarios (ejemplo: solo ADMIN puede crear/borrar masivamente, usuarios pueden ver/actualizar su propio perfil)
                        // Esto se refinará con @PreAuthorize a nivel de método en el controlador
                        .requestMatchers(HttpMethod.GET, "/users").hasAuthority(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/user").hasAuthority(Role.ADMIN.name()) // POST user (crear por admin)
                        // .requestMatchers(HttpMethod.GET, "/users/{id:[0-9]+}").hasAnyAuthority(Role.ADMIN.name(), Role.USER.name()) // Permitir a USER ver su perfil, ADMIN ver cualquiera
                        // .requestMatchers(HttpMethod.PUT, "/users/{id:[0-9]+}").hasAnyAuthority(Role.ADMIN.name(), Role.USER.name()) // Permitir a USER actualizar su perfil, ADMIN cualquiera
                        // .requestMatchers(HttpMethod.DELETE, "/users/{id:[0-9]+}").hasAuthority(Role.ADMIN.name())

                        // Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
} 