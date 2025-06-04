package com.photolax;

import com.photolax.model.Role;
import com.photolax.model.User;
import com.photolax.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ApiPhotolaxApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiPhotolaxApplication.class, args);
    }

    @Bean
    public CommandLineRunner createAdminUserIfNotFound(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
                User adminUser = User.builder()
                        .username("admin")
                        .email("admin@photolax.com")
                        .password(passwordEncoder.encode("adminpassword"))
                        .firstName("Admin") 
                        .lastName("User")
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(adminUser);
                System.out.println(">>>> Admin user created: admin / adminpassword <<<<");
            }
        };
    }
} 